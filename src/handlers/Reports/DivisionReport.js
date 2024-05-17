const { decode } = require("jsonwebtoken");
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
  JamiaatModel,
  CollegesModel,
  MaqamActivitiesModel,
} = require("../../model/reports");
const { months, getRoleFlow } = require("../../utils");
const Response = require("../Response");
const { UserModel, DivisionModel } = require("../../model");

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
  nizamSalah,
  shabBedari,
  anyOther,
  rawabitDecided,
  current,
  meetings,
  litrature,
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
    (month,
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
      !nizamSalah ||
      !shabBedari ||
      !anyOther ||
      !rawabitDecided ||
      !current ||
      !meetings ||
      !litrature ||
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
      !rafaqaFilled)
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
          message: "Access Denied",
          status: 401,
        });
      }
      const decoded = decode(token.split(" ")[1]);
      const userId = decoded?.id;
      const user = await UserModel.findOne({ _id: userId });
      if (user?.nazim !== "division") {
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
        currentSum,
        currentManual,
        meetings,
        meetingsManual,
        meetingsSum,
        litrature,
        commonLiteratureDistribution,
        registeredTosee,
        commonStudentMeetings,
        literatureSum,
        uploadedCommonStudentMeetings,
        manualCommonStudentMeetings,
        commonStudentMeetingsSum,
        uploadedCommonLiteratureDistribution,
        manualCommonLiteratureDistribution,
        commonLiteratureDistributionSum,
        totalLibraries,
        totalBooks,
        totalIncrease,
        totalDecrease,
        totalBookRent,
        totalReceived,
        totalSold,
        umeedwaranFilled,
        manualUmeedwaran,
        umeedwaranFilledSum,
        rafaqaFilled,
        jamiaatA,
        jamiaatB,
        jamiaatC,
        jamiaatD,
        jamiaatE,
        collegesA,
        collegesB,
        collegesC,
        collegesD,
        rafaqaFilledSum,
        manualRafaqaFilled,
        monthlyReceivingGoal,
        uploadedCurrent,
        manualCurrent,
        rwabitMeetingsGoal,
        uploadedMeetings,
        manualMeetings,
        uploadedLitrature,
        manualLitrature,
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
      const reportExist = await DivisionReportModel.findOne({
        month: {
          $gte: new Date(yearExist, monthExist, 1),
          $lt: new Date(yearExist, monthExist + 1, 1),
        },
        userId,
      });

      const reports = await DivisionReportModel.findOne({
        month: req.body.month,
      });
      if (reports) {
        return this.sendResponse(req, res, {
          message: `Report already created for ${
            months[monthDate.getMonth()]
          }.`,
          status: 400,
        });
      }
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
      });

      const newJamiaat = new JamiaatModel({
        jamiaatA,
        jamiaatB,
        jamiaatC,
        jamiaatD,
        jamiaatE,
      });
      const newColleges = new CollegesModel({
        collegesA,
        collegesB,
        collegesC,
        collegesD,
      });
      const newdivisionActivityId = new DivisionActivitiesModel({
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

      let newTd = new ToseeDawatModel({
        rawabitDecided,
        literatureDistribution: litrature,
        meetings,
        meetingsManual,
        meetingsSum,
        current,
        currentManual,
        currentSum,
        registered: registeredTosee ? true : false,
        commonStudentMeetings,
        commonLiteratureDistribution,
        rwabitMeetingsGoal,
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
        monthlyReceivingGoal,
      });
      const newRsd = new RozShabBedariModel({
        umeedwaranFilled,
        manualUmeedwaran,
        umeedwaranFilledSum,
        manualRafaqaFilled,
        rafaqaFilled,
        rafaqaFilledSum,
      });
      const wi = await newWI.save();
      const divisionActivityId = await newdivisionActivityId.save();
      const maqamTanzeem = await newMaqamTanzeem.save();
      const mentionedActivity = await newMentionedActivity.save();
      const otherActivity = await newOtherActivity.save();
      const td = await newTd.save();
      const maqamDivisionLib = await newMaqamDivisionLib.save();
      const paighamDigest = await newPaighamDigest.save();
      const rsd = await newRsd.save();
      const clg = await newColleges.save();
      const jami = await newJamiaat.save();

      let newDivisionReport = new DivisionReportModel({
        month,
        comments,
        userId,
        divisionAreaId: user?.userAreaId,
        maqamTanzeemId: maqamTanzeem?._id,
        wiId: wi._id,
        divisionActivityId: divisionActivityId._id,
        mentionedActivityId: mentionedActivity._id,
        otherActivityId: otherActivity._id,
        tdId: td._id,
        maqamDivisionLibId: maqamDivisionLib?._id,
        paighamDigestId: paighamDigest?._id,
        rsdId: rsd._id,
        jamiaatId: jami?._id,
        collegesId: clg?._id,
      });

      await newDivisionReport.save();
      return this.sendResponse(req, res, {
        message: "Division Report Added",
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
      // if (user?.nazim !== "province") {
      reports = await DivisionReportModel.find({
        divisionAreaId: accessList,
      })
        .populate([
          { path: "userId", select: ["_id", "email", "name", "age"] },
          { path: "divisionAreaId", populate: { path: "province" } },
          { path: "maqamTanzeemId" },
          { path: "wiId" },
          { path: "divisionActivityId" },
          { path: "mentionedActivityId" },
          { path: "otherActivityId" },
          { path: "tdId" },
          { path: "maqamDivisionLibId" },
          { path: "paighamDigestId" },
          { path: "rsdId" },
          { path: "collegesId" },
          { path: "jamiaatId" },
        ])
        .sort({ createdAt: -1 });
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
      const { divisionAreaId } = await DivisionReportModel.findOne({
        _id,
      }).select("divisionAreaId");
      if (!accessList.includes(divisionAreaId.toString())) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 401,
        });
      }
      const reports = await DivisionReportModel.findOne({ _id }).populate([
        { path: "userId", select: ["_id", "email", "name", "age"] },
        { path: "divisionAreaId", populate: { path: "province" } },
        { path: "maqamTanzeemId" },
        { path: "wiId" },
        { path: "divisionActivityId" },
        { path: "mentionedActivityId" },
        { path: "otherActivityId" },
        { path: "tdId" },
        { path: "maqamDivisionLibId" },
        { path: "paighamDigestId" },
        { path: "rsdId" },
        { path: "collegesId" },
        { path: "jamiaatId" },
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

      const isExist = await DivisionReportModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Report not found",
          status: 404,
        });
      }
      const mentionedActivity = isExist?.mentionedActivityId;
      const td = isExist?.tdId;
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
        "divisionActivityId",
        "mentionedActivityId",
        "maqamDivisionLibId",
        "paighamDigestId",
        "rsdId",
        "tdId",
        "otherActivityId",
        "collegesId",
        "jamiaatId",
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
        divisionActivityId: [
          "studyCircle",
          "ijtNazmeen",
          "ijtUmeedwaran",
          "sadurMeeting",
        ],
        mentionedActivityId: [
          "ijtRafaqa",
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
        paighamDigestId: ["totalReceived", "totalSold","monthlyReceivingGoal"],
        rsdId: [
          "umeedwaranFilled",
          "manualUmeedwaran",
          "umeedwaranFilledSum",
          "manualRafaqaFilled",
          "rafaqaFilled",
          "rafaqaFilledSum",
        ],
        tdId: [
          "rawabitDecided",
          "current",
          "currentManual",
          "currentSum",
          "meetings",
          "meetingsManual",
          "meetingsSum",
          "rwabitMeetingsGoal",
          "literatureDistribution",
          "commonLiteratureDistribution",
          "commonStudentMeetings",
        ],
        otherActivityId: [
          "anyOther",
          "shabBedari",
          "nizamSalah",
          "hadithCircle",
          "rawabitParties",
          "dawatiWafud",
          "tarbiyatGaah",
        ],
        collegesId: ["collegesA", "collegesB", "collegesC", "collegesD"],
        jamiaatId: ["jamiaatA", "jamiaatB", "jamiaatC", "jamiaatD", "jamiaatE"],
      };

      const returnData = (arr) => {
        const rs = {};
        arr.forEach((element) => {
          rs[element] = dataToUpdate[element];
        });

        return rs;
      };

      const returnModel = (i) => {
        switch (i) {
          case "maqamTanzeemId":
            return MaqamTanzeemModel;
          case "wiId":
            return WorkerInfoModel;
          case "divisionActivityId":
            return DivisionActivitiesModel;
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
          case "jamiaatId":
            return JamiaatModel;
          case "collegesId":
            return CollegesModel;
          default:
            return null;
        }
      };

      for (let i = 0; i < refsToUpdate.length; i++) {
        await returnModel(refsToUpdate[i]).updateOne(
          { _id: isExist?.[refsToUpdate[i]] },
          { $set: returnData(obj[refsToUpdate[i]]) }
        );
      }
      // Update the DivisionReportModel
      const updatedDivisionReport = await DivisionReportModel.updateOne(
        { _id },
        { $set: dataToUpdate }
      );
      // update studyCircle of division
      await MentionedActivitiesModel.findOneAndUpdate(
        {
          _id: mentionedActivity,
        },
        {
          $set: {
            studyCircle: dataToUpdate?.studyCircleMentioned,
          },
        }
      );
      console.log(dataToUpdate?.litrature)
      await ToseeDawatModel.findOneAndUpdate(
        {
          _id: td,
        },
        {
          $set: {
            literatureDistribution: dataToUpdate?.litrature,
          },
        }
      );
      if (updatedDivisionReport?.modifiedCount > 0) {
        return this.sendResponse(req, res, {
          message: "Report updated successfully",
        });
      }

      return this.sendResponse(req, res, {
        message: "Nothing to update",
        status: 500,
      });
    } catch (err) {
      console.error(err);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  filledUnfilled = async (req, res) => {
    try {
      const { queryDate } = req.query;
      const token = req.headers.authorization;
      if (!token) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 401,
        });
      }
      const decoded = decode(token.split(" ")[1]);
      if (!decoded) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 401,
        });
      }
      const userId = decoded?.id;
      const user = await UserModel.findOne({ _id: userId });
      const { userAreaId: id, nazim: key } = user;
      const accessList = (await getRoleFlow(id, key)).map((i) => i.toString());
      const today = Date.now();
      let desiredYear = new Date(today).getFullYear();
      let desiredMonth = new Date(today).getMonth();
      if (queryDate) {
        const convert = new Date(queryDate);
        desiredYear = new Date(convert).getFullYear();
        desiredMonth = new Date(convert).getMonth();
      }
      const startDate = new Date(desiredYear, desiredMonth, 0);
      const endDate = new Date(desiredYear, desiredMonth + 1, 1);
      const divisionReports = await DivisionReportModel.find({
        month: {
          $gte: startDate,
          $lte: endDate,
        },
        divisionAreaId: accessList,
      }).populate("divisionAreaId userId");
      const allDivisions = await DivisionModel.find({ _id: accessList });
      const divisionReportsAreaIds = divisionReports.map((i) =>
        i?.divisionAreaId?._id?.toString()
      );
      const allDivisionsAreaIds = allDivisions.map((i) => i?._id?.toString());
      const unfilledArr = [];
      allDivisionsAreaIds.forEach((i, index) => {
        if (!divisionReportsAreaIds.includes(i)) {
          unfilledArr.push(i);
        }
      });
      const unfilled = await DivisionModel.find({ _id: unfilledArr });
      return this.sendResponse(req, res, {
        message: "Reports data fetched successfully",
        status: 200,
        data: {
          unfilled: unfilled,
          totaldivision: allDivisionsAreaIds?.length,
          allDivisions: allDivisions,
        },
      });
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
}

module.exports = DivisionReport;
