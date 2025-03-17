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
  JamiaatModel,
  CollegesModel,
  MuntakhibTdModel,
  HalqaReportModel,
  IlaqaReportModel,
  BaitulmalModel,
} = require("../../model/reports");
const { months, getRoleFlow } = require("../../utils");
const Response = require("../Response");
const {
  UserModel,
  MaqamModel,
  IlaqaModel,
  HalqaModel,
  CountryModel,
  ProvinceModel,
  DivisionModel,
} = require("../../model");
const { auditLogger } = require("../../middlewares/auditLogger");

const isDataComplete = (dataToUpdate) => {
  const requiredKeys = [
    "month",
    "comments",
    "arkan",
    "umeedWaran",
    "rafaqa",
    "karkunan",
    "shaheen",
    "members",
    "ijtArkan",
    "studyCircle",
    "ijtNazmeen",
    "ijtUmeedwaran",
    "sadurMeeting",
    "rehaishHalqay",
    "taleemHalqay",
    "totalHalqay",
    "subRehaishHalqay",
    "subTaleemHalqay",
    "subTotalHalqay",
    "busmSchoolUnits",
    "busmRehaishUnits",
    "busmTotalUnits",
    "ijtRafaqa",
    "studyCircleMentioned",
    "ijtKarkunan",
    "darseQuran",
    "shaheenMeeting",
    "paighamEvent",
    "dawatiWafud",
    "rawabitParties",
    "nizamSalah",
    "shabBedari",
    "anyOther",
    "rawabitDecided",
    "totalLibraries",
    "totalBooks",
    "totalIncrease",
    "totalDecrease",
    "totalBookRent",
    "totalReceived",
    "totalSold",
    "jamiaatA",
    "jamiaatB",
    "jamiaatC",
    "jamiaatD",
    "jamiaatE",
    "collegesA",
    "collegesB",
    "collegesC",
    "collegesD",
  ];

  const missingKeys = requiredKeys.filter((key) => !(key in dataToUpdate));
  if (missingKeys.length > 0) {
    return false;
  }
  return true;
};

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
        rafaqaFilledSum,
        manualRafaqaFilled,
        jamiaatA,
        jamiaatB,
        jamiaatC,
        jamiaatD,
        jamiaatE,
        collegesA,
        collegesB,
        collegesC,
        collegesD,
        monthlyReceivingGoal,
        uploadedCurrent,
        manualCurrent,
        rwabitMeetingsGoal,
        uploadedMeetings,
        manualMeetings,
        uploadedLitrature,
        manualLitrature,
        monthlyIncome,
        monthlyExpenditure,
        savings,
        loss,
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
        maqamAreaId: user?.userAreaId,
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
      const newBaitulmal = new BaitulmalModel({
        monthlyIncome,
        monthlyExpenditure,
        savings,
        loss,
      });
      let newTd;

      if (await isMuntakhib(userId)) {
        newTd = new MuntakhibTdModel({
          rawabitDecided,
          uploadedCurrent,
          manualCurrent,
          currentSum,
          rwabitMeetingsGoal,
          uploadedMeetings,
          manualMeetings,
          meetingsSum,
          uploadedLitrature,
          manualLitrature,
          literatureSum,
          uploadedCommonStudentMeetings,
          manualCommonStudentMeetings,
          commonStudentMeetingsSum,
          uploadedCommonLiteratureDistribution,
          manualCommonLiteratureDistribution,
          commonLiteratureDistributionSum,
        });
      } else {
        newTd = new ToseeDawatModel({
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
      }
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
        rafaqaFilled,
        manualRafaqaFilled,
        rafaqaFilledSum,
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
      const baitId = await newBaitulmal.save();
      const clg = await newColleges.save();
      const jami = await newJamiaat.save();
      let newMaqamReport;
      if (await isMuntakhib(userId)) {
        newMaqamReport = new MaqamReportModel({
          month,
          comments,
          userId,
          maqamAreaId: user?.userAreaId,
          maqamTanzeemId: maqamTanzeem?._id,
          wiId: wi._id,
          maqamActivityId: maqamActivity._id,
          mentionedActivityId: mentionedActivity._id,
          otherActivityId: otherActivity._id,
          muntakhibTdId: td._id,
          maqamDivisionLibId: maqamDivisionLib?._id,
          paighamDigestId: paighamDigest?._id,
          rsdId: rsd._id,
          jamiaatId: jami?._id,
          collegesId: clg?._id,
          baitulmalId: baitId?._id,
        });
      } else {
        newMaqamReport = new MaqamReportModel({
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
          jamiaatId: jami?._id,
          collegesId: clg?._id,
          baitulmalId: baitId?._id,
        });
      }
      await newMaqamReport.save();
      await auditLogger(
        user,
        "MAQAM_REPORT_CREATED",
        "A user Created Maqam report",
        req
      );
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
      const userExist = await UserModel.findOne({ _id: userId });
      if (!userExist) {
        return this.sendResponse(req, res, {
          message: "User not found!",
          status: 404,
        });
      }
      const dataToUpdate = req.body;
      if (isDataComplete(dataToUpdate) == false) {
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
      const mentionedActivity = isExist?.mentionedActivityId;
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
      let refsToUpdate;

      (await isMuntakhib(userId))
        ? (refsToUpdate = [
            "maqamTanzeemId",
            "wiId",
            "maqamActivityId",
            "mentionedActivityId",
            "otherActivityId",
            "muntakhibTdId",
            "maqamDivisionLibId",
            "paighamDigestId",
            "rsdId",
            "collegesId",
            "jamiaatId",
            "baitulmalId",
          ])
        : (refsToUpdate = [
            "maqamTanzeemId",
            "wiId",
            "maqamActivityId",
            "mentionedActivityId",
            "otherActivityId",
            "tdId",
            "maqamDivisionLibId",
            "paighamDigestId",
            "rsdId",
            "collegesId",
            "jamiaatId",
            "baitulmalId",
          ]);
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
          "ijtNazmeen",
          "ijtUmeedwaran",
          "sadurMeeting",
          "studyCircle",
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
        paighamDigestId: ["totalReceived", "totalSold", "monthlyReceivingGoal"],
        rsdId: [
          "umeedwaranFilled",
          "rafaqaFilled",
          "manualUmeedwaran",
          "umeedwaranFilledSum",
          "manualRafaqaFilled",
          "rafaqaFilledSum",
        ],
        tdId: [
          "rawabitDecided",
          "literatureDistribution",
          "meetings",
          "meetingsManual",
          "meetingsSum",
          "current",
          "currentManual",
          "currentSum",
          "commonStudentMeetings",
          "commonLiteratureDistribution",
          "rwabitMeetingsGoal",
        ],
        muntakhibTdId: [
          "rawabitDecided",
          "uploadedCurrent",
          "manualCurrent",
          "currentSum",
          "rwabitMeetingsGoal",
          "uploadedMeetings",
          "manualMeetings",
          "meetingsSum",
          "uploadedLitrature",
          "manualLitrature",
          "literatureSum",
          "uploadedCommonStudentMeetings",
          "manualCommonStudentMeetings",
          "commonStudentMeetingsSum",
          "uploadedCommonLiteratureDistribution",
          "manualCommonLiteratureDistribution",
          "commonLiteratureDistributionSum",
        ],
        otherActivityId: [
          "anyOther",
          "shabBedari",
          "nizamSalah",
          "hadithCircle",
          "rawabitParties",
          "dawatiWafud",
        ],
        baitulmalId: ["monthlyIncome", "monthlyExpenditure", "savings", "loss"],
        collegesId: ["collegesA", "collegesB", "collegesC", "collegesD"],
        jamiaatId: ["jamiaatA", "jamiaatB", "jamiaatC", "jamiaatD", "jamiaatE"],
      };

      const returnData = (arr, key) => {
        const rs = {};
        arr?.forEach((element) => {
          if (element === "registered") {
            if (key === "tdId" || key === "muntakhibTdId") {
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
              rs[element] = { ...dataToUpdate[element], registered: false };
            }
          } else if (element === "literatureDistribution") {
            rs[element] = req?.body?.litrature;
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
          case "muntakhibTdId":
            return MuntakhibTdModel;
          case "otherActivityId":
            return OtherActivitiesModel;
          case "jamiaatId":
            return JamiaatModel;
          case "collegesId":
            return CollegesModel;
          case "baitulmalId":
            return BaitulmalModel;
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
      // update studyCircle of maqam
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

      const updatedMaqamReport = await MaqamReportModel.updateOne(
        { _id },
        { $set: dataToUpdate }
      );

      if (updatedMaqamReport?.modifiedCount > 0) {
        await auditLogger(
          isExist,
          "MAQAM_REPORT_UPDATED",
          "A user Updated Maqam report",
          req
        );
        return this.sendResponse(req, res, {
          message: "Report updated successfully",
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
  getReports = async (req, res) => {
    try {
      const { areaId } = req?.query;
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
      let allChildAreaIDs;
      let userArea;
      if (user.userAreaType === "Country") {
        userArea = await CountryModel.findOne({ _id: user.userAreaId });
      } else if (user.userAreaType === "Province") {
        userArea = await ProvinceModel.findOne({ _id: user.userAreaId });
      } else if (user.userAreaType === "Division") {
        userArea = await DivisionModel.findOne({ _id: user.userAreaId });
      } else if (user.userAreaType === "Maqam") {
        userArea = await MaqamModel.findOne({ _id: user.userAreaId });
      } else if (user.userAreaType === "Ilaqa") {
        userArea = await IlaqaModel.findOne({ _id: user.userAreaId });
      } else {
        userArea = await HalqaModel.findOne({ _id: user.userAreaId });
      }
      allChildAreaIDs = [
        ...(userArea.childDistrictIDs || []),
        ...(userArea.childDivisionIDs || []),
        ...(userArea.childHalqaIDs || []),
        ...(userArea.childIlaqaIDs || []),
        ...(userArea.childMaqamIDs || []),
        ...(userArea.childProvinceIDs || []),
        ...(userArea.childTehsilIDs || []),
        userArea._id,
      ];
      let reports;
      const inset = parseInt(req.query.inset) || 0;
      const offset = parseInt(req.query.offset) || 10;
      const year = req.query.year;
      const month = req.query.month;
      let startDate = new Date(Date.UTC(year, month - 1, 1));
      const isIlaqa = await IlaqaModel.find({ maqam: areaId });
      if (isIlaqa.length > 0 && areaId) {
        if (Object.keys(areaId).length > 0) {
          const now = new Date();
          const currentYear = now.getFullYear();
          const currentMonth = now.getMonth() - 1;

          // Get the first day of the current month at 00:00:00.000Z
          const firstDayOfMonth = new Date(
            Date.UTC(currentYear, currentMonth, 1)
          );

          // Get the last day of the current month at 23:59:59.999Z
          const lastDayOfMonth = new Date(
            Date.UTC(currentYear, currentMonth + 1, 0, 23, 59, 59, 999)
          );
          // Format the dates to ISO strings
          const formattedFirstDay = firstDayOfMonth.toISOString();
          const formattedLastDay = lastDayOfMonth.toISOString();
          const ilaqaQuery = {
            ilaqaAreaId: allChildAreaIDs,
            month: {
              $gte: formattedFirstDay,
              $lte: formattedLastDay,
            },
          };
          reports = await IlaqaReportModel.find(ilaqaQuery)
            .populate([
              { path: "userId", select: ["_id", "email", "name", "age"] },
              { path: "maqamTanzeemId" },
              { path: "wiId" },
              { path: "maqamActivityId" },
              { path: "mentionedActivityId" },
              { path: "otherActivityId" },
              { path: "tdId" },
              { path: "maqamDivisionLibId" },
              { path: "paighamDigestId" },
              { path: "rsdId" },
              { path: "ilaqaAreaId", populate: { path: "maqam" } },
            ])
            .sort({ createdAt: -1 });
        }
      } else if (areaId && isIlaqa.length === 0) {
        if (Object.keys(areaId).length > 0) {
          const now = new Date();
          const currentYear = now.getFullYear();
          const currentMonth = now.getMonth() - 1;

          // Get the first day of the current month at 00:00:00.000Z
          const firstDayOfMonth = new Date(
            Date.UTC(currentYear, currentMonth, 1)
          );

          // Get the last day of the current month at 23:59:59.999Z
          const lastDayOfMonth = new Date(
            Date.UTC(currentYear, currentMonth + 1, 0, 23, 59, 59, 999)
          );
          // Format the dates to ISO strings
          const formattedFirstDay = firstDayOfMonth.toISOString();
          const formattedLastDay = lastDayOfMonth.toISOString();
          const halqaQuery = {
            halqaAreaId: allChildAreaIDs,
            month: {
              $gte: formattedFirstDay,
              $lte: formattedLastDay,
            },
          };

          reports = await HalqaReportModel.find(halqaQuery)
            .populate([
              { path: "userId", select: ["_id", "email", "name", "age"] },
              { path: "wiId" },
              { path: "halqaActivityId" },
              { path: "otherActivityId" },
              { path: "tdId" },
              { path: "halqaLibId" },
              { path: "rsdId" },
              {
                path: "halqaAreaId",
                populate: {
                  path: "parentId",
                  populate: { path: "province" },
                },
              },
            ])
            .sort({ createdAt: -1 });
        }
      } else {
        if (year && month) {
          reports = await MaqamReportModel.find({
            maqamAreaId: allChildAreaIDs,
            month: startDate,
          }).populate({ path: "maqamAreaId" });
        } else {
          reports = await MaqamReportModel.find({
            maqamAreaId: allChildAreaIDs,
          })
            .select("_id")
            .sort({ createdAt: -1 });

          if (reports.length > 0) {
            reports = await MaqamReportModel.find({
              maqamAreaId: allChildAreaIDs,
            })
              .populate([
                { path: "userId", select: ["_id", "email", "name", "age"] },
                {
                  path: "maqamAreaId",
                },
              ])
              .sort({ createdAt: -1 })
              .skip(inset)
              .limit(offset);
          }
        }
      }
      let total = await MaqamReportModel.find({
        maqamAreaId: allChildAreaIDs,
      });
      const totalReport = total.length;
      reports = { data: reports, length: totalReport };
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
      const { date } = req?.query;
      if (!token) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 401,
        });
      }
      const _id = req.params.id;
      const decoded = decode(token.split(" ")[1]);
      const userId = decoded?.id;
      const user = await UserModel.findOne({ _id: userId });
      const { userAreaId: id, nazim: key } = user;
      if (!_id) {
        return this.sendResponse(req, res, {
          message: "Id is required",
          status: 404,
        });
      }
      let report;
      if (date) {
        report = await MaqamReportModel.findOne({
          maqamAreaId: _id,
          month: date,
        }).populate({ path: "maqamAreaId" });
        if (!report) {
          return this.sendResponse(req, res, {
            message: "Report not found",
            status: 400,
          });
        }
      } else {
        const accessList = (await getRoleFlow(id, key)).map((i) =>
          i.toString()
        );
        const { maqamAreaId } = await MaqamReportModel.findOne({ _id }).select(
          "maqamAreaId"
        );
        if (!accessList.includes(maqamAreaId.toString())) {
          return this.sendResponse(req, res, {
            message: "Access Denied",
            status: 401,
          });
        }
        report = await MaqamReportModel.findOne({ _id }).populate([
          { path: "userId", select: ["_id", "email", "name", "age"] },
          { path: "maqamAreaId", populate: { path: "province" } },
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
        ]);
      }
      return this.sendResponse(req, res, {
        data: report,
        message: "Report Fetched Successfully",
      });
    } catch (err) {
      console.log(err);
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

      // Check if token is present
      if (!token) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 401,
        });
      }

      // Decode the token
      const decoded = decode(token.split(" ")[1]);
      if (!decoded) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 401,
        });
      }

      // Extract user data from decoded token
      const userId = decoded.id;
      const user = await UserModel.findById(userId);
      if (!user) {
        return this.sendResponse(req, res, {
          message: "User not found",
          status: 404,
        });
      }

      const { userAreaId: id, nazim: key, userAreaType } = user;

      // Fetch user area model based on userAreaType
      let userArea;
      switch (userAreaType) {
        case "Country":
          userArea = await CountryModel.findById(id);
          break;
        case "Province":
          userArea = await ProvinceModel.findById(id);
          break;
        case "Division":
          userArea = await DivisionModel.findById(id);
          break;
        case "Maqam":
          userArea = await MaqamModel.findById(id);
          break;
        case "Ilaqa":
          userArea = await IlaqaModel.findById(id);
          break;
        default:
          userArea = await HalqaModel.findById(id);
      }

      if (!userArea) {
        return this.sendResponse(req, res, {
          message: "User Area not found",
          status: 404,
        });
      }

      // Combine all child area IDs into a single array
      const allChildAreaIDs = [...(userArea.childMaqamIDs || [])];

      // Determine the desired date range
      const today = new Date();
      const desiredYear = queryDate
        ? new Date(queryDate).getFullYear()
        : today.getFullYear();
      const desiredMonth = queryDate
        ? new Date(queryDate).getMonth()
        : today.getMonth();

      const startDate = new Date(desiredYear, desiredMonth, 1); // First day of the month
      const endDate = new Date(desiredYear, desiredMonth + 1, 0); // Last day of the month

      // Add the user's area ID to the list of child areas
      allChildAreaIDs.push(id);

      // Aggregation pipeline to fetch maqam reports for the given date range and area IDs
      const maqamReports = await MaqamReportModel.aggregate([
        {
          $match: {
            month: { $gte: startDate, $lte: endDate },
            maqamAreaId: { $in: allChildAreaIDs },
          },
        },
        {
          $lookup: {
            from: "maqams", // Reference to MaqamModel collection
            localField: "maqamAreaId",
            foreignField: "_id",
            as: "maqamArea",
          },
        },
        { $unwind: "$maqamArea" },
        {
          $project: {
            _id: 1,
            maqamAreaId: 1,
          },
        },
      ]);

      // Fetch all maqams in the user's area
      const allMaqams = await MaqamModel.find({
        _id: { $in: allChildAreaIDs },
        disabled: false, // Ensure that disabled is false
      }).select("name _id province");

      // Create a set for fast lookup
      const maqamReportsAreaIds = new Set(
        maqamReports.map((i) => i?.maqamAreaId?._id?.toString())
      );
      const allMaqamAreaIds = allMaqams.map((i) => i?._id?.toString());

      // Identify unfilled areas by comparing the two sets
      const unfilledArr = allMaqamAreaIds.filter(
        (i) => !maqamReportsAreaIds.has(i)
      );

      // Fetch unfilled maqams from the database
      const unfilled = await MaqamModel.find({ _id: { $in: unfilledArr } });

      return this.sendResponse(req, res, {
        message: "Reports data fetched successfully",
        status: 200,
        data: {
          unfilled: unfilled,
          totalMaqam: allMaqamAreaIds.length,
          allMaqams: allMaqams,
        },
      });
    } catch (error) {
      console.error("Error occurred:", error);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
}

module.exports = MaqamReport;
