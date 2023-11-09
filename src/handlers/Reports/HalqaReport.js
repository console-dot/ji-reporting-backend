const { decode } = require('jsonwebtoken');
const {
  WorkerInfoModel,
  HalqaActivityModel,
  OtherActivitiesModel,
  ToseeDawatModel,
  HalqaLibraryModel,
  RozShabBedariModel,
  HalqaReportModel,
} = require('../../model/reports');
const { months, getRoleFlow } = require('../../utils');
const Response = require('../Response');
const { UserModel } = require('../../model');

const isDataComplete = ({
  month,
  comments,
  arkan,
  umeedWaran,
  rafaqa,
  karkunan,
  ijtRafaqa,
  ijtKarkunan,
  studyCircle,
  darseQuran,
  dawatiWafud,
  rawabitParties,
  hadithCircle,
  nizamSalah,
  shabBedari,
  anyOther,
  rawabitDecided,
  current,
  meetings,
  literatureDistribution,
  commonStudentMeetings,
  commonLiteratureDistribution,
  books,
  increase,
  decrease,
  bookRent,
  umeedwaranFilled,
  rafaqaFilled,
}) => {
  if (
    !month ||
    !comments ||
    !arkan ||
    !umeedWaran ||
    !rafaqa ||
    !karkunan ||
    !ijtRafaqa ||
    !ijtKarkunan ||
    !studyCircle ||
    !darseQuran ||
    !dawatiWafud ||
    !rawabitParties ||
    !hadithCircle ||
    !nizamSalah ||
    !shabBedari ||
    !anyOther ||
    !rawabitDecided ||
    !current ||
    !meetings ||
    !literatureDistribution ||
    !commonStudentMeetings ||
    !commonLiteratureDistribution ||
    !books ||
    !increase ||
    !decrease ||
    !bookRent ||
    !umeedwaranFilled ||
    !rafaqaFilled
  ) {
    return false;
  }
  return true;
};

class HalqaReport extends Response {
  createReport = async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return this.sendResponse(req, res, {
          message: 'Access Denied',
          status: 401,
        });
      }
      const decoded = decode(token.split(' ')[1]);
      const userId = decoded?.id;
      const user = await UserModel.findOne({ _id: userId });
      if (user?.nazim !== 'halqa') {
        return this.sendResponse(req, res, {
          message: 'Access denied',
          status: 401,
        });
      }
      const {
        month,
        comments,
        arkan,
        umeedWaran,
        rafaqa,
        karkunan,
        registeredWorker,
        ijtRafaqa,
        ijtKarkunan,
        studyCircle,
        darseQuran,
        dawatiWafud,
        rawabitParties,
        hadithCircle,
        nizamSalah,
        shabBedari,
        anyOther,
        rawabitDecided,
        current,
        meetings,
        literatureDistribution,
        registeredTosee,
        commonStudentMeetings,
        commonLiteratureDistribution,
        books,
        increase,
        decrease,
        bookRent,
        registeredLibrary,
        umeedwaranFilled,
        rafaqaFilled,
      } = req.body;
      if (
        !month ||
        !comments ||
        !arkan ||
        !umeedWaran ||
        !rafaqa ||
        !karkunan ||
        !ijtRafaqa ||
        !ijtKarkunan ||
        !studyCircle ||
        !darseQuran ||
        !dawatiWafud ||
        !rawabitParties ||
        !hadithCircle ||
        !nizamSalah ||
        !shabBedari ||
        !anyOther ||
        !rawabitDecided ||
        !current ||
        !meetings ||
        !literatureDistribution ||
        !commonStudentMeetings ||
        !commonLiteratureDistribution ||
        !books ||
        !increase ||
        !decrease ||
        !bookRent ||
        !umeedwaranFilled ||
        !rafaqaFilled
      ) {
        return this.sendResponse(req, res, {
          message: 'All fields are required',
          status: 400,
        });
      }
      const monthDate = new Date(month);
      const { yearExist, monthExist } = {
        yearExist: monthDate.getFullYear(),
        monthExist: monthDate.getMonth(),
      };
      const reportExist = await HalqaReportModel.findOne({
        month: {
          $gte: new Date(yearExist, monthExist, 1),
          $lt: new Date(yearExist, monthExist + 1, 1),
        },
        userId,
      });
      if (reportExist) {
        return this.sendResponse(req, res, {
          message: `Report already created for ${
            months[monthDate.getMonth()]
          }.`,
          status: 400,
        });
      }
      const newWI = new WorkerInfoModel({
        arkan,
        umeedWaran,
        rafaqa,
        karkunan,
        registered: registeredWorker,
      });
      const newHalqaActivity = new HalqaActivityModel({
        ijtRafaqa,
        ijtKarkunan,
        studyCircle,
        darseQuran,
      });
      const newOtherActivity = new OtherActivitiesModel({
        dawatiWafud,
        rawabitParties,
        hadithCircle,
        nizamSalah,
        shabBedari,
        anyOther,
      });
      const newTD = new ToseeDawatModel({
        rawabitDecided,
        current,
        meetings,
        literatureDistribution,
        registered: registeredTosee,
        commonStudentMeetings,
        commonLiteratureDistribution,
      });
      const newHalqaLib = new HalqaLibraryModel({
        books,
        increase,
        decrease,
        bookRent,
        registered: registeredLibrary,
      });
      const newRSD = new RozShabBedariModel({
        umeedwaranFilled,
        rafaqaFilled,
      });
      const wi = await newWI.save();
      const halqaActivity = await newHalqaActivity.save();
      const otherActivity = await newOtherActivity.save();
      const td = await newTD.save();
      const halqaLib = await newHalqaLib.save();
      const rsd = await newRSD.save();
      const newHalqaReport = new HalqaReportModel({
        comments,
        month,
        userId,
        halqaAreaId: user?.userAreaId,
        wiId: wi._id,
        halqaActivityId: halqaActivity._id,
        otherActivityId: otherActivity._id,
        tdId: td._id,
        halqaLibId: halqaLib._id,
        rsdId: rsd._id,
      });
      await newHalqaReport.save();
      return this.sendResponse(req, res, {
        message: 'Halqa Report Added',
        status: 201,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: 'Internal Server Error',
        status: 500,
      });
    }
  };
  getReports = async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return this.sendResponse(req, res, {
          message: 'Access Denied',
          status: 401,
        });
      }
      const decoded = decode(token.split(' ')[1]);
      const userId = decoded?.id;
      const user = await UserModel.findOne({ _id: userId });
      const { userAreaId: id, nazim: key } = user;
      const accessList = (await getRoleFlow(id, key)).map((i) => i.toString());
      const reports = await HalqaReportModel.find({
        halqaAreaId: accessList,
      }).populate([
        { path: 'userId', select: ['_id', 'email', 'name', 'age'] },
        { path: 'wiId' },
        { path: 'halqaActivityId' },
        { path: 'otherActivityId' },
        { path: 'tdId' },
        { path: 'halqaLibId' },
        { path: 'rsdId' },
        { path: 'halqaAreaId' },
      ]);
      return this.sendResponse(req, res, { data: reports });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: 'Internal Server Error',
        status: 500,
      });
    }
  };
  getSingleReport = async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return this.sendResponse(req, res, {
          message: 'Access Denied',
          status: 401,
        });
      }
      const _id = req.params.id;
      if (!_id) {
        return this.sendResponse(req, res, {
          message: 'Id is required',
          status: 404,
        });
      }
      const decoded = decode(token.split(' ')[1]);
      const userId = decoded?.id;
      const user = await UserModel.findOne({ _id: userId });
      const { userAreaId: id, nazim: key } = user;
      const accessList = (await getRoleFlow(id, key)).map((i) => i.toString());
      const { halqaAreaId } = await HalqaReportModel.findOne({ _id }).select(
        'halqaAreaId'
      );
      if (!accessList.includes(halqaAreaId.toString())) {
        return this.sendResponse(req, res, {
          message: 'Access Denied',
          status: 401,
        });
      }
      const reports = await HalqaReportModel.findOne({ _id }).populate([
        { path: 'userId', select: ['_id', 'email', 'name', 'age'] },
        { path: 'wiId' },
        { path: 'halqaActivityId' },
        { path: 'otherActivityId' },
        { path: 'tdId' },
        { path: 'halqaLibId' },
        { path: 'rsdId' },
        { path: 'halqaAreaId' },
      ]);
      return this.sendResponse(req, res, { data: reports });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: 'Internal Server Error',
        status: 500,
      });
    }
  };
  editReport = async (req, res) => {
    try {
      const token = req.headers.authorization;
      const _id = req.params.id;
      if (!token) {
        return this.sendResponse(req, res, {
          message: 'Access Denied',
          status: 401,
        });
      }
      if (!_id) {
        return this.sendResponse(req, res, {
          message: 'Id is required',
          status: 404,
        });
      }
      const decoded = decode(token.split(' ')[1]);
      const userId = decoded?.id;
      const dataToUpdate = req.body;
      if (!isDataComplete(dataToUpdate)) {
        return this.sendResponse(req, res, {
          message: 'All fields are required',
          status: 400,
        });
      }
      const isExist = await HalqaReportModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: 'Report not found',
          status: 404,
        });
      }
      if (isExist?.userId.toString() !== userId) {
        return this.sendResponse(req, res, {
          message: 'Access Denied',
          status: 401,
        });
      }
      const startDate = new Date(isExist?.createdAt);
      const currentDate = new Date();
      const difference = currentDate - startDate;
      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      const daysDifference = Math.floor(difference / millisecondsPerDay);
      if (daysDifference >= 5) {
        return this.sendResponse(req, res, {
          message: 'Cannot update after 5 days',
          status: 400,
        });
      }

      const updated = await HalqaReportModel.updateOne(
        { _id },
        { $set: dataToUpdate }
      );
      if (updated?.modifiedCount > 0) {
        return this.sendResponse(req, res, {
          message: 'Report updated',
        });
      }
      return this.sendResponse(req, res, {
        message: 'Nothing to update',
        status: 500,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: 'Internal Server Error',
        status: 500,
      });
    }
  };
}

module.exports = HalqaReport;