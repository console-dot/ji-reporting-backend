const { decode } = require("jsonwebtoken");
const {
  WorkerInfoModel,
  IlaqaReportModel,
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
const { UserModel, MaqamModel } = require("../../model");

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
    "uploadedCurrent",
    "manualCurrent",
    "rwabitMeetingsGoal",
    "uploadedMeetings",
    "manualMeetings",
    "uploadedLitrature",
    "manualLitrature",
    "uploadedCommonStudentMeetings",
    "manualCommonStudentMeetings",
    "uploadedCommonLiteratureDistribution",
    "manualCommonLiteratureDistribution",
    "totalLibraries",
    "totalBooks",
    "totalIncrease",
    "totalDecrease",
    "totalBookRent",
    "totalReceived",
    "totalSold",
    "uploadedUmeedwaran",
    "manualUmeedwaran",
    "manualRafaqa",
    "uploadedRafaqa",
  ];

  const missingKeys = requiredKeys.filter((key) => !(key in dataToUpdate));

  if (missingKeys.length > 0) {
    console.log("Missing keys:", missingKeys.join(", "));
    return false;
  }
  return true;
};

class IlaqaReport extends Response {
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
      if (user?.nazim !== "ilaqa") {
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
        uploadedCurrent,
        manualCurrent,
        rwabitMeetingsGoal,
        uploadedMeetings,
        manualMeetings,
        uploadedLitrature,
        manualLitrature,
        uploadedCommonStudentMeetings,
        manualCommonStudentMeetings,
        uploadedCommonLiteratureDistribution,
        manualCommonLiteratureDistribution,
        totalLibraries,
        totalBooks,
        totalIncrease,
        totalDecrease,
        totalBookRent,
        totalHalqaReceived,
        totalZeliHalqaReceived,
        totalHalqaSold,
        totalZeliHalqaSold,
        uploadedUmeedwaran,
        manualUmeedwaran,
        manualRafaqa,
        uploadedRafaqa,
        tarbiyatGaah,
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
      const reportExist = await IlaqaReportModel.findOne({
        month: {
          $gte: new Date(yearExist, monthExist, 1),
          $lt: new Date(yearExist, monthExist + 1, 1),
        },
        userId,
      });
      const reports = await IlaqaReportModel.findOne({ month: req.body.month });
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

      const newMaqamActivity = new MaqamActivitiesModel({
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
        tarbiyatGaah,
        dawatiWafud,
        rawabitParties,
        nizamSalah,
        shabBedari,
        anyOther,
      });
      const newTd = new ToseeDawatModel({
        rawabitDecided,
        uploadedCurrent,
        manualCurrent,
        rwabitMeetingsGoal,
        uploadedMeetings,
        manualMeetings,
        uploadedLitrature,
        manualLitrature,
        uploadedCommonStudentMeetings,
        manualCommonStudentMeetings,
        uploadedCommonLiteratureDistribution,
        manualCommonLiteratureDistribution,
      });
      const newMaqamDivisionLib = new MaqamDivisionLibraryModel({
        totalLibraries,
        totalBooks,
        totalIncrease,
        totalDecrease,
        totalBookRent,
      });
      const newPaighamDigest = new PaighamDigestModel({
        totalHalqaReceived,
        totalZeliHalqaReceived,
        totalHalqaSold,
        totalZeliHalqaSold,
      });
      const newRsd = new RozShabBedariModel({
        uploadedUmeedwaran,
        manualUmeedwaran,
        manualRafaqa,
        uploadedRafaqa,
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
      const newMaqamReport = new IlaqaReportModel({
        month,
        comments,
        userId,
        ilaqaAreaId: user?.userAreaId,
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
        message: "Ilaqa Report Added",
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
      // if (user?.nazim !== 'province') {
      reports = await IlaqaReportModel.find({
        ilaqaAreaId: accessList,
      })
        .populate([
          { path: "userId", select: ["_id", "email", "name", "age"] },
          { path: "ilaqaAreaId", populate: { path: "maqam" } },
          { path: "maqamTanzeemId" },
          { path: "wiId" },
          { path: "maqamActivityId" },
          { path: "mentionedActivityId" },
          { path: "otherActivityId" },
          { path: "tdId" },
          { path: "maqamDivisionLibId" },
          { path: "paighamDigestId" },
          { path: "rsdId" },
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
      const { ilaqaAreaId } = await IlaqaReportModel.findOne({ _id }).select(
        "ilaqaAreaId"
      );
      if (!accessList.includes(ilaqaAreaId.toString())) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 401,
        });
      }
      const reports = await IlaqaReportModel.findOne({ _id }).populate([
        { path: "userId", select: ["_id", "email", "name", "age"] },
        { path: "ilaqaAreaId", populate: { path: "maqam" } },
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
      if (isDataComplete(dataToUpdate) == false) {
        return this.sendResponse(req, res, {
          message: "All fields are required",
          status: 400,
        });
      }
      const isExist = await IlaqaReportModel.findOne({ _id });
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
        paighamDigestId: [
          "totalHalqaReceived",
          "totalZeliHalqaReceived",
          "totalHalqaSold",
          "totalZeliHalqaSold",
        ],
        rsdId: [
          "manualUmeedwaran",
          "uploadedUmeedwaran",
          "uploadedRafaqa",
          "manualRafaqa",
        ],
        tdId: [
          "rawabitDecided",
          "uploadedCurrent",
          "manualCurrent",
          "rwabitMeetingsGoal",
          "uploadedMeetings",
          "manualMeetings",
          "uploadedLitrature",
          "manualLitrature",
          "uploadedCommonStudentMeetings",
          "manualCommonStudentMeetings",
          "uploadedCommonLiteratureDistribution",
          "manualCommonLiteratureDistribution",
          "registered",
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
              rs[element] = { ...dataToUpdate[element], registered: false };
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

      // Update the DivisionReportModel
      const updatedMaqamReport = await IlaqaReportModel.updateOne(
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

      const ilaqaReports = await IlaqaReportModel.find({
        month: {
          $gte: startDate,
          $lte: endDate,
        },
        ilaqaAreaId: accessList,
      }).populate("ilaqaAreaId userId");
      const allIlaqas = await MaqamModel.find({ _id: accessList });
      const maqamReportsAreaIds = ilaqaReports.map((i) =>
        i?.ilaqaAreaId?._id?.toString()
      );
      const allIlaqaAreaIds = allIlaqas.map((i) => i?._id?.toString());
      const unfilledArr = [];
      allIlaqaAreaIds.forEach((i, index) => {
        if (!maqamReportsAreaIds.includes(i)) {
          unfilledArr.push(i);
        }
      });
      const unfilled = await MaqamModel.find({ _id: unfilledArr });
      return this.sendResponse(req, res, {
        message: "Reports data fetched successfully",
        status: 200,
        data: {
          unfilled: unfilled,
          totalmaqam: allIlaqaAreaIds?.length,
          allIlaqas: allIlaqas,
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

module.exports = IlaqaReport;
