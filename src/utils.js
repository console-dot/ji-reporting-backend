const {
  MaqamModel,
  DivisionModel,
  DistrictModel,
  TehsilModel,
  HalqaModel,
  UserModel,
  ProvinceModel,
  IlaqaModel,
  CountryModel,
} = require("./model");

const getImmediateUser = async (userAreaId, userAreaType) => {
  let req = undefined;
  switch (userAreaType) {
    case "Province":
      req = await ProvinceModel.findOne({ _id: userAreaId });
      return req?.country;
    case "Maqam":
      req = await MaqamModel.findOne({ _id: userAreaId });
      return req?.province;
    case "Division":
      req = await DivisionModel.findOne({ _id: userAreaId });
      return req?.province;
    case "District":
      req = await DistrictModel.findOne({ _id: userAreaId });
      return req?.division;
    case "Tehsil":
      req = await TehsilModel.findOne({ _id: userAreaId });
      return req?.district;
    case "Halqa":
      req = await HalqaModel.findOne({ _id: userAreaId }).populate("parentId");
      if (req?.parentType === "Tehsil") {
        req = await HalqaModel.findOne({ _id: userAreaId }).populate({
          path: "parentId",
          populate: {
            path: "district",
          },
        });
        return req?.parentId?.district?.division;
      } else {
        return req?.parentId?._id;
      }
    case "Ilaqa":
      req = await IlaqaModel.findOne({ _id: userAreaId });
      return req?.maqam;
    default:
      return null;
  }
};

const getPopulateMethod = (type) => {
  switch (type) {
    case "Maqam":
      return { path: "province" };
    case "Tehsil":
      return {
        path: "district",
        populate: { path: "division", populate: { path: "province" } },
      };
    default:
      return null;
  }
};

const getRoleFlow = async (id, key) => {
  const getHalqaList = async (parentId) => {
    const halqaList = await HalqaModel.find({ parentId });
    return halqaList.map((item) => item?._id);
  };

  switch (key.toLowerCase()) {
    case "halqa":
      return [id];

    case "ilaqa":
      const ilaqaHalqaList = await getHalqaList(id);
      return [...ilaqaHalqaList, id];
    case "tehsil":
    case "maqam":
      const ilaqaList = await IlaqaModel.find({ maqam: id });
      // Get the halqa documents where the parent is directly the provided maqam ID
      const directHalqaList = await HalqaModel.find({ parentId: id });
      // Map over each ilaqa to retrieve its associated halqas
      const ilaqaHalqaPromises = ilaqaList.map((ilaqa) =>
        getHalqaList(ilaqa?._id)
      );
      const ilaqaHalqaLists = await Promise.all(ilaqaHalqaPromises);
      // Flatten the list of associated halqas from ilaqas
      const allIlaqaHalqas = ilaqaHalqaLists.flat();
      // Combine all the halqas: direct halqas and associated halqas from ilaqas
      const allHalqas = [...directHalqaList, ...allIlaqaHalqas, ...ilaqaList];
      // Return the IDs of all halqas
      return [...allHalqas.map((halqa) => halqa._id), id];
    case "district":
      const tehsilList = await TehsilModel.find({ district: id });
      const halqaPromises = tehsilList.map((item) => getHalqaList(item?._id));
      const halqaLists = await Promise.all(halqaPromises);
      return [...tehsilList.map((item) => item?._id), ...halqaLists.flat(), id];

    case "division":
      const directDivisionHalqas = await HalqaModel.find({ parentId: id });
      const districtList = await DistrictModel.find({ division: id });
      const divisionPromises = districtList.map((item) =>
        getRoleFlow(item?._id, "district")
      );
      const divisionResults = await Promise.all(divisionPromises);
      return [
        ...directDivisionHalqas.map((item) => item?._id),
        ...divisionResults.flat(),
        ...districtList.map((item) => item?._id),
        id,
      ];

    case "province":
      const divisionList = await DivisionModel.find({ province: id });
      const provincePromises = divisionList.map((item) =>
        getRoleFlow(item?._id, "division")
      );
      const provinceResults = await Promise.all(provincePromises);
      const maqamList = await MaqamModel.find({ province: id });
      const provincePromisesm = maqamList.map((item) =>
        getRoleFlow(item?._id, "maqam")
      );
      const provinceResultsm = await Promise.all(provincePromisesm);
      return [
        ...provinceResults.flat(),
        ...divisionList.map((item) => item?._id),
        ...provinceResultsm.flat(),
        ...maqamList.map((item) => item?._id),
        id,
      ];
    case "country":
      const provinceList = await ProvinceModel?.find({ country: id });
      const countryPromices = provinceList?.map((province) =>
        getRoleFlow(province?._id, "province")
      );
      const countryResultsm = await Promise.all(countryPromices);
      return [...countryResultsm.flat(), id];
    default:
      return [];
  }
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getParentId = async (_id) => {
  const getModal = (userAreaType) => {
    switch (userAreaType) {
      case "Province":
        return null;
      case "Division":
        return ProvinceModel;
      case "District":
        return DivisionModel;
      case "Tehsil":
        return DistrictModel;
      case "Halqa":
        return TehsilModel;
      case "Maqam":
        return ProvinceModel;
    }
  };
  const userExist = await UserModel.findOne({ _id });
  if (!userExist) {
    return null;
  }
  const { userAreaId, userAreaType } = userExist;
  const modal = getModal(userAreaType);
  let parentAreaId;
  if (modal) {
    const { _id } = await modal?.findOne({
      _id: userAreaId,
    });
    parentAreaId = _id;
  } else {
    return null;
  }
  if (!parentAreaId) return null;
  const { _id: parentId } = await UserModel.findOne({
    userAreaId: parentAreaId,
    isDeleted: false,
  });
  return parentId;
};

module.exports = {
  getImmediateUser,
  getPopulateMethod,
  months,
  getRoleFlow,
  getParentId,
};
