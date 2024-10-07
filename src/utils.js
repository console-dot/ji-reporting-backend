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
const mongoose = require("mongoose");
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
const cache = {
  halqas: [],
  ilaqas: [],
  tehsils: [],
  districts: [],
  divisions: [],
  maqams: [],
  provinces: [],
};

const cacheAllData = async () => {
  cache.halqas = await HalqaModel.find().lean();

  cache.ilaqas = await IlaqaModel.find().lean();

  cache.tehsils = await TehsilModel.find().lean();

  cache.districts = await DistrictModel.find().lean();

  cache.divisions = await DivisionModel.find().lean();

  cache.maqams = await MaqamModel.find().lean();

  cache.provinces = await ProvinceModel.find().lean();
};

const getRoleFlow = async (id, key) => {
  const getHalqaList = (parentId) => {
    return cache.halqas
      .filter((halqa) => halqa.parentId.toString() === parentId.toString()) // Ensure parentId is compared as a string
      .map((item) => item._id);
  };

  switch (key.toLowerCase()) {
    case "halqa":
      return [id.toString()];

    case "ilaqa":
      const ilaqaHalqaList = getHalqaList(id);
      return [...ilaqaHalqaList, id.toString()];

    case "tehsil":
    case "maqam":
      const ilaqaList = cache.ilaqas.filter(
        (ilaqa) => ilaqa.maqam.toString() === id.toString()
      );

      const directHalqaList = getHalqaList(id);

      const ilaqaHalqaLists = ilaqaList.map((ilaqa) => getHalqaList(ilaqa._id));
      const allIlaqaHalqas = [].concat(...ilaqaHalqaLists);

      const allHalqas = [
        ...directHalqaList,
        ...allIlaqaHalqas,
        ...ilaqaList.map((ilaqa) => ilaqa._id),
      ];

      return [...allHalqas, id.toString()];

    case "district":
      const tehsilList = cache.tehsils.filter(
        (tehsil) => tehsil.district.toString() === id.toString()
      );
      const halqaLists = tehsilList.map((tehsil) => getHalqaList(tehsil._id));
      return [
        ...tehsilList.map((item) => item._id),
        ...[].concat(...halqaLists),
        id.toString(),
      ];

    case "division":
      const directDivisionHalqas = getHalqaList(id);
      const districtList = cache.districts.filter(
        (district) => district.division.toString() === id.toString()
      );
      const divisionResults = await Promise.all(
        districtList.map((item) => getRoleFlow(item._id, "district"))
      );
      return [
        ...directDivisionHalqas,
        ...[].concat(...divisionResults),
        ...districtList.map((item) => item._id),
        id.toString(),
      ];

    case "province":
      const divisionList = cache.divisions.filter(
        (division) => division.province.toString() === id.toString()
      );
      const provinceResults = await Promise.all(
        divisionList.map((item) => getRoleFlow(item._id, "division"))
      );
      const maqamList = cache.maqams.filter(
        (maqam) => maqam.province.toString() === id.toString()
      );
      const provinceResultsm = await Promise.all(
        maqamList.map((item) => getRoleFlow(item._id, "maqam"))
      );
      return [
        ...[].concat(...provinceResults),
        ...divisionList.map((item) => item._id),
        ...[].concat(...provinceResultsm),
        ...maqamList.map((item) => item._id),
        id.toString(),
      ];

    case "country":
      const provinceList = cache.provinces.filter(
        (province) => province.country.toString() === id.toString()
      );
      const countryResults = await Promise.all(
        provinceList.map((province) => getRoleFlow(province._id, "province"))
      );
      return [...[].concat(...countryResults), id.toString()];

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
  cacheAllData,
  getRoleFlow,
  getParentId,
};
