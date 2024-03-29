const {
  MaqamModel,
  DivisionModel,
  DistrictModel,
  TehsilModel,
  HalqaModel,
  UserModel,
  ProvinceModel,
} = require("./model");

const getImmediateUser = async (userAreaId, userAreaType) => {
  let req = undefined;
  switch (userAreaType) {
    case "Province":
      return null;
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
      req = await HalqaModel.findOne({ _id: userAreaId });
      return req?.parentId;
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

    case "tehsil":
    case "maqam":
      const halqaList = await getHalqaList(id);
      return [...halqaList, id];

    case "district":
      const tehsilList = await TehsilModel.find({ district: id });
      const halqaPromises = tehsilList.map((item) => getHalqaList(item?._id));
      const halqaLists = await Promise.all(halqaPromises);
      return [...tehsilList.map((item) => item?._id), ...halqaLists.flat(), id];

    case "division":
      const districtList = await DistrictModel.find({ division: id });
      const divisionPromises = districtList.map((item) =>
        getRoleFlow(item?._id, "district")
      );
      const divisionResults = await Promise.all(divisionPromises);
      return [
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
    case "pakistan":
      const provinceList = await ProvinceModel?.find({ countryId: id });
      const countryPromices = provinceList?.map((province) =>
        getRoleFlow(province?._id, "province")
      );
      const countryResultsm = await Promise.all(countryPromices);
      return [...countryResultsm.flat()];
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
