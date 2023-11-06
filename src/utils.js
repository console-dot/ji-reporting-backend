const {
  MaqamModel,
  DivisionModel,
  DistrictModel,
  TehsilModel,
  HalqaModel,
} = require('./model');

const getImmediateUser = async (userAreaId, userAreaType) => {
  let req = undefined;
  switch (userAreaType) {
    case 'Province':
      return null;
    case 'Maqam':
      req = await MaqamModel.findOne({ _id: userAreaId });
      return req?.province;
    case 'Division':
      req = await DivisionModel.findOne({ _id: userAreaId });
      return req?.province;
    case 'District':
      req = await DistrictModel.findOne({ _id: userAreaId });
      return req?.division;
    case 'Tehsil':
      req = await TehsilModel.findOne({ _id: userAreaId });
      return req?.district;
    case 'Halqa':
      req = await HalqaModel.findOne({ _id: userAreaId });
      return req?.parentId;
    default:
      return null;
  }
};

const getPopulateMethod = (type) => {
  switch (type) {
    case 'Maqam':
      return { path: 'province' };
    case 'Tehsil':
      return {
        path: 'district',
        populate: { path: 'division', populate: { path: 'province' } },
      };
    default:
      return null;
  }
};

const getRoleFlow = async (id, key) => {
  switch (key) {
    case 'halqa': {
      return [id];
    }
    case 'tehsil': {
      const halqaList = await HalqaModel.find({ parentId: id });
      return [...halqaList.map((i) => i?._id)];
    }
    case 'maqam': {
      const halqaList = await HalqaModel.find({ parentId: id });
      return [...halqaList.map((i) => i?._id)];
    }
    case 'district': {
      const tehsilList = await TehsilModel.find({ district: id });
      let temp = [...tehsilList.map((i) => i?._id)];
      let temp2 = [];
      for (let i = 0; i < temp.length; temp++) {
        const halqaList = await HalqaModel.find({ parentId: temp[i] });
        temp2 = [...temp2, ...halqaList.map((j) => j?._id)];
      }
      return [...temp, ...temp2];
    }
    case 'district': {
      const tehsilList = await TehsilModel.find({ district: id });
      let temp = [...tehsilList.map((i) => i?._id)];
      let temp2 = [];
      for (let i = 0; i < temp.length; temp++) {
        const halqaList = await HalqaModel.find({ parentId: temp[i] });
        temp2 = [...temp2, ...halqaList.map((j) => j?._id)];
      }
      return [...temp, ...temp2];
    }
    case 'division': {
      const districtList = await DistrictModel.find({ division: id });
      const temp0 = [...districtList.map((i) => i?._id)];
      let temp = [];
      let temp2 = [];
      for (let k = 0; k < temp0.length; temp0++) {
        const tehsilList = await TehsilModel.find({ district: temp0[k] });
        temp = [...temp, ...tehsilList.map((i) => i?._id)];
        for (let i = 0; i < temp.length; temp++) {
          const halqaList = await HalqaModel.find({ parentId: temp[i] });
          temp2 = [...temp2, ...halqaList.map((j) => j?._id)];
        }
      }
      return [...temp, ...temp0, ...temp2];
    }
    case 'province': {
      let temp = [];
      let temp0 = [];
      let temp2 = [];
      const divisionList = await DivisionModel.find({ province: id });
      const temp1 = [divisionList.map((i) => i?._id)];
      for (let l = 0; l < temp1.length; l++) {
        const districtList = await DistrictModel.find({ division: temp1[l] });
        temp0 = [...temp0, ...districtList.map((i) => i?._id)];
        for (let k = 0; k < temp0.length; temp0++) {
          const tehsilList = await TehsilModel.find({ district: temp0[k] });
          temp = [...temp, ...tehsilList.map((i) => i?._id)];
          for (let i = 0; i < temp.length; temp++) {
            const halqaList = await HalqaModel.find({ parentId: temp[i] });
            temp2 = [...temp2, ...halqaList.map((j) => j?._id)];
          }
        }
      }
      return [...temp, ...temp0, ...temp1, ...temp2];
    }
    default:
      return [];
  }
};

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

module.exports = { getImmediateUser, getPopulateMethod, months, getRoleFlow };
