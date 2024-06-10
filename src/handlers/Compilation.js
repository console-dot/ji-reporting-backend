const { ProvinceReportModel, MarkazReportModel, MaqamReportModel, DivisionReportModel, IlaqaReportModel, HalqaReportModel } = require("../model/reports");
const Response = require("./Response");
function sumObjectsInArray(array) {
    if (array.length === 0) return {}; 

    const sumObject = {};

    array.forEach(obj => {
        Object.keys(obj).forEach(key => {
            if (isNaN(obj[key]) || key.startsWith('_')) return;

            if (!(key in sumObject)) {
                sumObject[key] = obj[key];
            } else {
                sumObject[key] += obj[key];
            }
        });
    });

    return sumObject;
}
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
      startDate = new Date(`${startDate}-01T00:00:00.000Z`);
      endDate = new Date(`${endDate}-01T00:00:00.000Z`);
      endDate.setMonth(endDate.getMonth() + 1);
      console.log(areaType);
      const query = {
        month: {
          $gte: startDate,
          $lt: endDate,
        }
      };
      let data;
      switch(areaType) {
        case 'province':
            query.provinceAreaId = areaId;
            data = await ProvinceReportModel.find(query);
            break;
        case 'markaz':
            query.markazAreaId = areaId;
            data = await MarkazReportModel.find(query);
            break;
        case 'maqam':
            query.maqamAreaId = areaId;
            console.log(query)
            let a = await MaqamReportModel.find(query).populate([
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
              ]);;
              data=sumObjectsInArray(a);
            break;
        case 'division':
            query.divisionAreaId = areaId;
            data = await DivisionReportModel.find(query);
            break;
        case 'ilaqa':
            query.ilaqaAreaId = areaId;
            data = await IlaqaReportModel.find(query);
            break;
        case 'halqa':
            query.halqaAreaId = areaId;
            data = await HalqaReportModel.find(query);
            break;
        default:
            return this.sendResponse(req, res, {
                message: "Invalid area type!",
                status: 400,
            });
        }
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
