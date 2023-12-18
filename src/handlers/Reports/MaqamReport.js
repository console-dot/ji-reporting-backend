const { decode } = require("jsonwebtoken");
const {
  WorkerInfoModel,
  MaqamReportModel,
  MaqamActivitiesModel,
  MaqamTanzeemModel,
  MentionedActivitiesModel,
  OtherActivitiesModel,
  ToseeDawatModel,
  MaqamDivisionLibraryModel,
  PaighamDigestModel,
  RozShabBedariModel,
} = require("../../model/reports");
const { months, getRoleFlow } = require("../../utils");
const Response = require("../Response");
const { UserModel } = require("../../model");

const isDataComplete = ({
  month,
  comments,
  arkan,
  umeedWaran,
  rafaqa,
  karkunan,
  shaheen,
  members,
  ijtArkan,
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
  nizamSalah,
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
    !ijtArkan ||
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
    !nizamSalah ||
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

class MaqamReport extends Response {
  createReport = async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 401,
        });
      }
      const decoded = decode(token.split(" ")[1]);
      const userId = decoded?.id;
      const user = await UserModel.findOne({ _id: userId });
      if (user?.nazim !== "maqam") {
        return this.sendResponse(req, res, {
          message: "Access denied",
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
        ijtArkan,
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
          message: "All fields are required",
          status: 400,
        });
      }
      const monthDate = new Date(month);
      const { yearExist, monthExist } = {
        yearExist: monthDate.getFullYear(),
        monthExist: monthDate.getMonth(),
      };
      const reportExist = await MaqamReportModel.findOne({
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
      umeedWaran.registered = umeedWaran?.registered ? true : false;
      rafaqa.registered = rafaqa?.registered ? true : false;
      karkunan.registered = karkunan?.registered ? true : false;
      shaheen.registered = shaheen?.registered ? true : false;
      members.registered = members?.registered ? true : false;
      const newWI = new WorkerInfoModel({
        arkan,
        umeedWaran,
        rafaqa,
        karkunan,
        shaheen,
        members,
      });
      ijtArkan.registered = ijtArkan?.registered ? true : false;
      studyCircle.registered = studyCircle?.registered ? true : false;
      ijtNazmeen.registered = ijtNazmeen?.registered ? true : false;
      ijtUmeedwaran.registered = ijtUmeedwaran?.registered ? true : false;
      sadurMeeting.registered = sadurMeeting?.registered ? true : false;
      const newMaqamActivity = new MaqamActivitiesModel({
        ijtArkan,
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
      ijtRafaqa.registered = ijtRafaqa?.registered ? true : false;
      studyCircleMentioned.registered = studyCircleMentioned?.registered
        ? true
        : false;
      ijtKarkunan.registered = ijtKarkunan?.registered ? true : false;
      darseQuran.registered = darseQuran?.registered ? true : false;
      shaheenMeeting.registered = shaheenMeeting?.registered ? true : false;
      paighamEvent.registered = paighamEvent?.registered ? true : false;
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
        nizamSalah,
        shabBedari,
        anyOther,
      });
      const newTd = new ToseeDawatModel({
        rawabitDecided,
        current,
        meetings,
        literatureDistribution,
        registered: registeredTosee ? true : false,
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
      const maqamActivity = await newMaqamActivity.save();
      const maqamTanzeem = await newMaqamTanzeem.save();
      const mentionedActivity = await newMentionedActivity.save();
      const otherActivity = await newOtherActivity.save();
      const td = await newTd.save();
      const maqamDivisionLib = await newMaqamDivisionLib.save();
      const paighamDigest = await newPaighamDigest.save();
      const rsd = await newRsd.save();
      const newMaqamReport = new MaqamReportModel({
        month,
        comments,
        userId,
        maqamAreaId: user?.userAreaId,
        maqamTanzeemId: maqamTanzeem?._id,
        wiId: wi._id,
        maqamActivityId: maqamActivity._id,
        mentionedActivityId: mentionedActivity._id,
        otherActivityId: otherActivity._id,
        tdId: td._id,
        maqamDivisionLibId: maqamDivisionLib?._id,
        paighamDigestId: paighamDigest?._id,
        rsdId: rsd._id,
      });
      await newMaqamReport.save();
      return this.sendResponse(req, res, {
        message: "Maqam Report Added",
        status: 201,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  getReports = async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 401,
        });
      }
      const decoded = decode(token.split(" ")[1]);
      const userId = decoded?.id;
      const user = await UserModel.findOne({ _id: userId });
      const { userAreaId: id, nazim: key } = user;
      const accessList = (await getRoleFlow(id, key)).map((i) => i.toString());
      let reports;
      if (user?.nazim !== "province") {
        reports = await MaqamReportModel.find({
          maqamAreaId: accessList,
        }).populate([
          { path: "userId", select: ["_id", "email", "name", "age"] },
          { path: "maqamAreaId", populate: { path: "province" } },
          { path: "maqamTanzeemId" },
          { path: "wiId" },
          { path: "maqamActivityId" },
          { path: "mentionedActivityId" },
          { path: "otherActivityId" },
          { path: "tdId" },
          { path: "maqamDivisionLibId" },
          { path: "paighamDigestId" },
          { path: "rsdId" },
        ]);
      } else {
        reports = await MaqamReportModel.find().populate([
          { path: "userId", select: ["_id", "email", "name", "age"] },
          { path: "maqamAreaId", populate: { path: "province" } },
          { path: "maqamTanzeemId" },
          { path: "wiId" },
          { path: "maqamActivityId" },
          { path: "mentionedActivityId" },
          { path: "otherActivityId" },
          { path: "tdId" },
          { path: "maqamDivisionLibId" },
          { path: "paighamDigestId" },
          { path: "rsdId" },
        ]);
      }
      return this.sendResponse(req, res, { data: reports });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  getSingleReport = async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 401,
        });
      }
      const _id = req.params.id;
      if (!_id) {
        return this.sendResponse(req, res, {
          message: "Id is required",
          status: 404,
        });
      }
      const decoded = decode(token.split(" ")[1]);
      const userId = decoded?.id;
      const user = await UserModel.findOne({ _id: userId });
      const { userAreaId: id, nazim: key } = user;
      const accessList = (await getRoleFlow(id, key)).map((i) => i.toString());
      const { maqamAreaId } = await MaqamReportModel.findOne({ _id }).select(
        "maqamAreaId"
      );
      if (!accessList.includes(maqamAreaId.toString())) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 401,
        });
      }
      const reports = await MaqamReportModel.findOne({ _id }).populate([
        { path: "userId", select: ["_id", "email", "name", "age"] },
        { path: "maqamAreaId", populate: { path: "province" } },
        { path: "maqamTanzeemId" },
        { path: "wiId" },
        { path: "maqamActivityId" },
        { path: "mentionedActivityId" },
        { path: "otherActivityId" },
        { path: "tdId" },
        { path: "maqamDivisionLibId" },
        { path: "paighamDigestId" },
        { path: "rsdId" },
      ]);
      return this.sendResponse(req, res, { data: reports });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
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
          message: "Access Denied",
          status: 401,
        });
      }
      if (!_id) {
        return this.sendResponse(req, res, {
          message: "Id is required",
          status: 404,
        });
      }
      const decoded = decode(token.split(" ")[1]);
      const userId = decoded?.id;
      const dataToUpdate = req.body;
      if (!isDataComplete(dataToUpdate)) {
        return this.sendResponse(req, res, {
          message: "All fields are required",
          status: 400,
        });
      }
      const isExist = await MaqamReportModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Report not found",
          status: 404,
        });
      }
      if (isExist?.userId.toString() !== userId) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
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
          message: "Cannot update after 5 days",
          status: 400,
        });
      }

      // Update referenced models
      const refsToUpdate = [
        "maqamTanzeemId",
        "wiId",
        "maqamActivityId",
        "mentionedActivityId",
        "otherActivityId",
        "tdId",
        "maqamDivisionLibId",
        "paighamDigestId",
        "rsdId",
      ];

      const obj = {
        maqamTanzeemId: [
          "rehaishHalqay",
          "taleemHalqay",
          "totalHalqay",
          "subRehaishHalqay",
          "subTaleemHalqay",
          "subTotalHalqay",
          "busmSchoolUnits",
          "busmRehaishUnits",
          "busmTotalUnits",
        ],
        wiId: [
          "arkan",
          "umeedWaran",
          "rafaqa",
          "karkunan",
          "shaheen",
          "members",
        ],
        maqamActivityId: [
          "ijtArkan",
          "studyCircle",
          "ijtNazmeen",
          "ijtUmeedwaran",
          "sadurMeeting",
        ],
        mentionedActivityId: [
          "ijtRafaqa",
          "studyCircle",
          "ijtKarkunan",
          "darseQuran",
          "shaheenMeeting",
          "paighamEvent",
        ],
        maqamDivisionLibId: [
          "totalLibraries",
          "totalBooks",
          "totalIncrease",
          "totalDecrease",
          "totalBookRent",
        ],
        paighamDigestId: ["totalReceived", "totalSold"],
        rsdId: ["umeedwaranFilled", "rafaqaFilled"],
        tdId: [
          "registered",
          "commonLiteratureDistribution",
          "commonStudentMeetings",
          "literatureDistribution",
          "meetings",
          "current",
          "rawabitDecided",
        ],
        otherActivityId: [
          "anyOther",
          "shabBedari",
          "nizamSalah",
          "hadithCircle",
          "rawabitParties",
          "dawatiWafud",
        ],
      };

      const returnData = (arr, key) => {
        const rs = {};
        arr.forEach((element) => {
          if (element === "registered") {
            if (key === "tdId") {
              rs[element] = dataToUpdate["registeredTosee"] ? true : false;
            }
            if (key === "wiId") {
              rs[element] = dataToUpdate["registeredWorker"] ? true : false;
            }
          } else if (
            element === "umeedWaran" ||
            element === "rafaqa" ||
            element === "karkunan" ||
            element === "shaheen" ||
            element === "members" ||
            element === "ijtArkan" ||
            element === "studyCircle" ||
            element === "ijtNazmeen" ||
            element === "sadurMeeting" ||
            element === "ijtUmeedWaran" ||
            element === "ijtRafaqa" ||
            element === "ijtKarkunan" ||
            element === "darseQuran" ||
            element === "shaheenMeeting" ||
            element === "paighamEvent"
          ) {
            if (
              dataToUpdate[element] &&
              dataToUpdate[element].hasOwnProperty("registered")
            ) {
              rs[element] = { ...dataToUpdate[element], registered: true };
            } else {
              rs[element] = { registered: false };
            }
          } else {
            rs[element] = dataToUpdate[element];
          }
        });

        return rs;
      };
      const returnModel = (i) => {
        switch (i) {
          case "maqamTanzeemId":
            return MaqamTanzeemModel;
          case "wiId":
            return WorkerInfoModel;
          case "maqamActivityId":
            return MaqamActivitiesModel;
          case "mentionedActivityId":
            return MentionedActivitiesModel;
          case "maqamDivisionLibId":
            return MaqamDivisionLibraryModel;
          case "paighamDigestId":
            return PaighamDigestModel;
          case "rsdId":
            return RozShabBedariModel;
          case "tdId":
            return ToseeDawatModel;
          case "otherActivityId":
            return OtherActivitiesModel;
          default:
            return null;
        }
      };

      for (let i = 0; i < refsToUpdate.length; i++) {
        await returnModel(refsToUpdate[i]).updateOne(
          { _id: isExist?.[refsToUpdate[i]] },
          { $set: returnData(obj[refsToUpdate[i]], refsToUpdate[i]) }
        );
      }

      // Update the DivisionReportModel
      const updatedMaqamReport = await MaqamReportModel.updateOne(
        { _id },
        { $set: dataToUpdate }
      );

      if (updatedMaqamReport?.modifiedCount > 0) {
        return this.sendResponse(req, res, {
          message: "Report updated successfully",
        });
      }
      if (updated?.modifiedCount > 0) {
        return this.sendResponse(req, res, {
          message: "Report updated",
        });
      }
      return this.sendResponse(req, res, {
        message: "Nothing to update",
        status: 500,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
}

module.exports = MaqamReport;
