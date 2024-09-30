const { UserModel, IlaqaModel } = require("../model");
const {
  ProvinceReportModel,
  MarkazReportModel,
  MaqamReportModel,
  DivisionReportModel,
  IlaqaReportModel,
  HalqaReportModel,
} = require("../model/reports");
const Response = require("./Response");
function splitKeysAndRemoveFirst(obj) {
  const result = {};
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const parts = key.split("-");
      const newKey = parts.slice(1).join("-");
      result[newKey] = obj[key];
    }
  }
  return result;
}
function sumObjectsInArray(array) {
  if (array.length === 0) return {};

  const sumObject = {};

  array.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];

      if (typeof value === "object" && value !== null) {
        const nestedSum = sumObjectsInNestedObject(value, key, 1); // Start recursion depth at 1
        for (const nestedKey in nestedSum) {
          const newKey = nestedKey;
          if (!(newKey in sumObject)) {
            sumObject[newKey] = nestedSum[newKey];
          } else {
            sumObject[newKey] += nestedSum[newKey];
          }
        }
      } else if (typeof value === "number") {
        if (!(key in sumObject)) {
          sumObject[key] = value;
        } else {
          sumObject[key] += value;
        }
      }
    });
  });

  return splitKeysAndRemoveFirst(sumObject);
}

function sumObjectsInNestedObject(obj, parentKey = "", depth = 1) {
  if (depth > 5) return {}; // Maximum recursion depth reached, return an empty object

  const sum = {};
  for (const key in obj) {
    const value = obj[key];
    const currentKey = parentKey ? `${parentKey}-${key}` : key;
    if (typeof value === "object" && value !== null) {
      const nestedSum = sumObjectsInNestedObject(value, currentKey, depth + 1); // Increment depth
      for (const nestedKey in nestedSum) {
        const newKey = nestedKey;
        if (!(newKey in sum)) {
          sum[newKey] = nestedSum[newKey];
        } else {
          sum[newKey] += nestedSum[newKey];
        }
      }
    } else if (typeof value === "number") {
      if (!(currentKey in sum)) {
        sum[currentKey] = value;
      } else {
        sum[currentKey] += value;
      }
    }
  }
  return sum;
}
const isMuntakhib = async (userId) => {
  const isUser = await UserModel.findOne({ _id: userId });
  if (isUser) {
    const isIlaqa = await IlaqaModel.find({ maqam: isUser?.userAreaId });
    if (isIlaqa.length > 1) {
      return true;
    } else {
      return false;
    }
  }
};
class Compilation extends Response {
  getCompiledReports = async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 401,
        });
      }
      const areaId = req.params.id;

      let startDate = req.query.startDate;
      let endDate = req.query.endDate;
      const areaType = req.query.areaType;

      if (!startDate || !endDate) {
        return this.sendResponse(req, res, {
          message: "Please provide both startDate and endDate.",
          status: 400,
        });
      }

      let startDateObj, endDateObj;
      if (startDate.length === 4 && endDate.length === 4) {
        startDateObj = new Date(`${startDate}-01-01T00:00:00.000Z`);
        endDateObj = new Date(`${endDate}-12-31T23:59:59.999Z`);
      } else {
        startDateObj = new Date(`${startDate}-01T00:00:00.000Z`);
        endDateObj = new Date(`${endDate}-01T00:00:00.000Z`);
        endDateObj.setMonth(endDateObj.getMonth() + 1);
      }

    
      const query = {
        month: {
          $gte: startDateObj,
          $lt: endDateObj,
        },
      };

      let data;
      switch (areaType) {
        case "province":
          query.provinceAreaId = areaId;
          let provinceReports = await ProvinceReportModel.find(query)
            .populate([
              { path: "provinceTanzeemId" },
              { path: "provinceWorkerInfoId" },
              { path: "provinceActivityId" },
              { path: "mentionedActivityId" },
              { path: "otherActivityId" },
              { path: "tdId" },
              { path: "provinceDivisionLibId" },
              { path: "paighamDigestId" },
              { path: "rsdId" },
              { path: "collegesId" },
              { path: "jamiaatId" },
              { path: "baitulmalId" },
            ])
            .lean();
          data = sumObjectsInArray(provinceReports);
          break;
        case "country":
          let markazReports = await MarkazReportModel.find(query)
            .populate([
              { path: "markazTanzeemId" },
              { path: "markazWorkerInfoId" },
              { path: "markazActivityId" },
              { path: "mentionedActivityId" },
              { path: "otherActivityId" },
              { path: "tdId" },
              { path: "markazDivisionLibId" },
              { path: "rsdId" },
              { path: "collegesId" },
              { path: "jamiaatId" },
              { path: "baitulmalId" },
            ])
            .lean();
          data = sumObjectsInArray(markazReports);
          break;
        case "maqam":
          query.maqamAreaId = areaId;
          let a = await MaqamReportModel.find(query)
            .populate([
              { path: "maqamTanzeemId" },
              { path: "wiId" },
              { path: "maqamActivityId" },
              { path: "mentionedActivityId" },
              { path: "otherActivityId" },
              { path: "tdId" },
              { path: "muntakhibTdId" },
              { path: "maqamDivisionLibId" },
              { path: "paighamDigestId" },
              { path: "rsdId" },
              { path: "baitulmalId" },
              { path: "collegesId" },
              { path: "jamiaatId" },
            ])
            .lean();
          let b = sumObjectsInArray(a);
          
          let muntakhib = false;
          const isIlaqa = await IlaqaModel.find({ maqam: areaId });
          if (isIlaqa?.length > 0) {
            muntakhib = true;
          }
          data = { b, muntakhib: muntakhib };
          break;
        case "division":
          query.divisionAreaId = areaId;
          let divReprots = await DivisionReportModel.find(query)
            .populate([
              { path: "maqamTanzeemId" },
              { path: "wiId" },
              { path: "divisionActivityId" },
              { path: "mentionedActivityId" },
              { path: "otherActivityId" },
              { path: "tdId" },
              { path: "maqamDivisionLibId" },
              { path: "paighamDigestId" },
              { path: "baitulmalId" },
              { path: "rsdId" },
              { path: "collegesId" },
              { path: "jamiaatId" },
            ])
            .lean();
          data = sumObjectsInArray(divReprots);
          break;
        case "ilaqa":
          query.ilaqaAreaId = areaId;
          let ilaqaReports = await IlaqaReportModel.find(query)
            .populate([
              { path: "maqamTanzeemId" },
              { path: "wiId" },
              { path: "maqamActivityId" },
              { path: "mentionedActivityId" },
              { path: "otherActivityId" },
              { path: "tdId" },
              { path: "maqamDivisionLibId" },
              { path: "paighamDigestId" },
              { path: "baitulmalId" },
              { path: "rsdId" },
            ])
            .lean();
          
          break;
        case "halqa":
          query.halqaAreaId = areaId;
          let halqaReports = await HalqaReportModel.find(query)
            .populate([
              { path: "wiId" },
              { path: "halqaActivityId" },
              { path: "otherActivityId" },
              { path: "tdId" },
              { path: "halqaLibId" },
              { path: "rsdId" },
              { path: "halqaAreaId" },
              { path: "baitulmalId" },
            ])
            .lean();
          data = sumObjectsInArray(halqaReports);
          break;
        default:
          return this.sendResponse(req, res, {
            message: "Invalid area type!",
            status: 400,
          });
      }
      data.startDate = startDate;
      data.endDate = endDate;
      return this.sendResponse(req, res, {
        data: data,
        status: 200,
      });
    } catch (err) {
      console.error(err);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
}

module.exports = Compilation;
