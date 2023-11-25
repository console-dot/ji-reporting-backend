const { decode } = require('jsonwebtoken');
const {
  WorkerInfoModel,
  DivisionReportModel,
  DivisionActivitiesModel,
  MaqamTanzeemModel,
  MentionedActivitiesModel,
  OtherActivitiesModel,
  ToseeDawatModel,
  MaqamDivisionLibraryModel,
  PaighamDigestModel,
  RozShabBedariModel,  
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
  shaheen,
  members,
  studyCircle,
  ijtNazmeen,
  ijtUmeedwaran,
  sadurMeeting,
  rehaishHalqay,
  taleemHalqay,
  totalHalqay,
  subRehaishHalqay,
  subTaleemHalqay,
  subTotalHalqay,
  busmSchoolUnits,
  busmRehaishUnits,
  busmTotalUnits,
  ijtRafaqa,
  studyCircleMentioned,
  ijtKarkunan,
  darseQuran,
  shaheenMeeting,
  paighamEvent,
  dawatiWafud,
  rawabitParties,
  hadithCircle,
  nazimSalah,
  shabBedari,
  anyOther,
  rawabitDecided,
  current,
  meetings,
  literatureDistribution,
  commonStudentMeetings,
  commonLiteratureDistribution,
  totalLibraries,
  totalBooks,
  totalIncrease,
  totalDecrease,
  totalBookRent,
  totalReceived,
  totalSold,
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
    !shaheen ||
    !members ||
    !studyCircle ||
    !ijtNazmeen ||
    !ijtUmeedwaran ||
    !sadurMeeting ||
    !rehaishHalqay ||
    !taleemHalqay ||
    !totalHalqay ||
    !subRehaishHalqay ||
    !subTaleemHalqay ||
    !subTotalHalqay ||
    !busmSchoolUnits ||
    !busmRehaishUnits ||
    !busmTotalUnits ||
    !ijtRafaqa ||
    !studyCircleMentioned ||
    !ijtKarkunan ||
    !darseQuran ||
    !shaheenMeeting ||
    !paighamEvent ||
    !dawatiWafud ||
    !rawabitParties ||
    !hadithCircle ||
    !nazimSalah ||
    !shabBedari ||
    !anyOther ||
    !rawabitDecided ||
    !current ||
    !meetings ||
    !literatureDistribution ||
    !commonStudentMeetings ||
    !commonLiteratureDistribution ||
    !totalLibraries ||
    !totalBooks ||
    !totalIncrease ||
    !totalDecrease ||
    !totalBookRent ||
    !totalReceived ||
    !totalSold ||
    !umeedwaranFilled ||
    !rafaqaFilled
  ) {
    return false;
  }
  return true;
};

class DivisionReport extends Response {
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
      if (user?.nazim !== 'division') {
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
        shaheen,
        members,
        registeredWorker,
        studyCircle,
        ijtNazmeen,
        ijtUmeedwaran,
        sadurMeeting,
        rehaishHalqay,
        taleemHalqay,
        totalHalqay,
        subRehaishHalqay,
        subTaleemHalqay,
        subTotalHalqay,
        busmSchoolUnits,
        busmRehaishUnits,
        busmTotalUnits,
        ijtRafaqa,
        studyCircleMentioned,
        ijtKarkunan,
        darseQuran,
        shaheenMeeting,
        paighamEvent,
        dawatiWafud,
        rawabitParties,
        hadithCircle,
        nazimSalah,
        shabBedari,
        anyOther,
        rawabitDecided,
        current,
        meetings,
        literatureDistribution,
        registeredTosee,
        commonStudentMeetings,
        commonLiteratureDistribution,
        totalLibraries,
        totalBooks,
        totalIncrease,
        totalDecrease,
        totalBookRent,
        totalReceived,
        totalSold,
        umeedwaranFilled,
        rafaqaFilled,
      } = req.body;
      if (!isDataComplete(req.body)) {
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
      const reportExist = await DivisionReportModel.findOne({
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
        shaheen,
        members,
        registered: registeredWorker,
      });
      const newDivisionActivity = new DivisionActivitiesModel({
        studyCircle,
        ijtNazmeen,
        ijtUmeedwaran,
        sadurMeeting,
      });
      const newMaqamTanzeem = new MaqamTanzeemModel({
        rehaishHalqay,
        taleemHalqay,
        totalHalqay,
        subRehaishHalqay,
        subTaleemHalqay,
        subTotalHalqay,
        busmSchoolUnits,
        busmRehaishUnits,
        busmTotalUnits,
      });
      const newMentionedActivity = new MentionedActivitiesModel({
        ijtRafaqa,
        studyCircle: studyCircleMentioned,
        ijtKarkunan,
        darseQuran,
        shaheenMeeting,
        paighamEvent,
      });
      const newOtherActivity = new OtherActivitiesModel({
        dawatiWafud,
        rawabitParties,
        hadithCircle,
        nazimSalah,
        shabBedari,
        anyOther,
      });
      const newTd = new ToseeDawatModel({
        rawabitDecided,
        current,
        meetings,
        literatureDistribution,
        registered: registeredTosee,
        commonStudentMeetings,
        commonLiteratureDistribution,
      });
      const newMaqamDivisionLib = new MaqamDivisionLibraryModel({
        totalLibraries,
        totalBooks,
        totalIncrease,
        totalDecrease,
        totalBookRent,
      });
      const newPaighamDigest = new PaighamDigestModel({
        totalReceived,
        totalSold,
      });
      const newRsd = new RozShabBedariModel({
        umeedwaranFilled,
        rafaqaFilled,
      });
      const wi = await newWI.save();
      const divisionActivity = await newDivisionActivity.save();
      const maqamTanzeem = await newMaqamTanzeem.save();
      const mentionedActivity = await newMentionedActivity.save();
      const otherActivity = await newOtherActivity.save();
      const td = await newTd.save();
      const maqamDivisionLib = await newMaqamDivisionLib.save();
      const paighamDigest = await newPaighamDigest.save();
      const rsd = await newRsd.save();
      const newDivisionReport = new DivisionReportModel({
        month,
        comments,
        userId,
        divisionAreaId: user?.userAreaId,
        maqamTanzeemId: maqamTanzeem?._id,
        wiId: wi._id,
        divisionActivityId: divisionActivity._id,
        mentionedActivityId: mentionedActivity._id,
        otherActivityId: otherActivity._id,
        tdId: td._id,
        maqamDivisionLibId: maqamDivisionLib?._id,
        paighamDigestId: paighamDigest?._id,
        rsdId: rsd._id,
      });
      await newDivisionReport.save();
      return this.sendResponse(req, res, {
        message: 'Division Report Added',
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
      const reports = await DivisionReportModel.find({
        divisionAreaId: accessList,
      }).populate([
        { path: 'userId', select: ['_id', 'email', 'name', 'age'] },
        { path: 'divisionAreaId', populate: { path: 'province' } },
        { path: 'maqamTanzeemId' },
        { path: 'wiId' },
        { path: 'divisionActivityId' },
        { path: 'mentionedActivityId' },
        { path: 'otherActivityId' },
        { path: 'tdId' },
        { path: 'maqamDivisionLibId' },
        { path: 'paighamDigestId' },
        { path: 'rsdId' },
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
      const { divisionAreaId } = await DivisionReportModel.findOne({
        _id,
      }).select('divisionAreaId');
      if (!accessList.includes(divisionAreaId.toString())) {
        return this.sendResponse(req, res, {
          message: 'Access Denied',
          status: 401,
        });
      }
      const reports = await DivisionReportModel.findOne({ _id }).populate([
        { path: 'userId', select: ['_id', 'email', 'name', 'age'] },
        { path: 'divisionAreaId', populate: { path: 'province' } },
        { path: 'maqamTanzeemId' },
        { path: 'wiId' },
        { path: 'divisionActivityId' },
        { path: 'mentionedActivityId' },
        { path: 'otherActivityId' },
        { path: 'tdId' },
        { path: 'maqamDivisionLibId' },
        { path: 'paighamDigestId' },
        { path: 'rsdId' },
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
      const isExist = await DivisionReportModel.findOne({ _id });
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

      const updated = await DivisionReportModel.updateOne(
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

module.exports = DivisionReport;