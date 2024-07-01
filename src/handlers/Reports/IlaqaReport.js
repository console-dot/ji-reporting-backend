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
  IlaqaDigestModel,
  MuntakhibTdModel,
  HalqaReportModel,
  BaitulmalModel,
} = require("../../model/reports");
const { months, getRoleFlow } = require("../../utils");
const Response = require("../Response");
const { UserModel, MaqamModel, IlaqaModel } = require("../../model");
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
    "totalLibraries",
    "totalBooks",
    "totalIncrease",
    "totalDecrease",
    "totalBookRent",
    "totalReceived",
    "manualReceived",
    "receivedSum",
    "totalSold",
    "manualSold",
    "soldSum",
    "monthlyReceivingGoal",
    "manualMonthlyReceivingGoal",
    "monthlyReceivingGoalSum",
    "uploadedUmeedwaran",
    "manualUmeedwaran",
    "umeedwaranFilledSum",
    "manualRafaqaFilled",
    "uploadedRafaqa",
    "rafaqaFilledSum",
  ];

  const missingKeys = requiredKeys.filter((key) => !(key in dataToUpdate));

  if (missingKeys.length > 0) {
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
        totalReceived,
        manualReceived,
        receivedSum,
        totalSold,
        manualSold,
        soldSum,
        monthlyReceivingGoal,
        manualMonthlyReceivingGoal,
        monthlyReceivingGoalSum,
        uploadedUmeedwaran,
        manualUmeedwaran,
        umeedwaranFilledSum,
        uploadedRafaqa,
        manualRafaqaFilled,
        rafaqaFilledSum,
        totalLibraries,
        totalBooks,
        totalIncrease,
        totalDecrease,
        totalBookRent,
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
      const reports = await IlaqaReportModel.findOne({
        month: {
          $gte: new Date(yearExist, monthExist, 1),
          $lt: new Date(yearExist, monthExist + 1, 1),
        },
        ilaqaAreaId: user?.userAreaId,
      });
      if (reports) {
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
        dawatiWafud,
        rawabitParties,
        nizamSalah,
        shabBedari,
        anyOther,
      });
      const newTd = new MuntakhibTdModel({
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
      const newMaqamDivisionLib = new MaqamDivisionLibraryModel({
        totalLibraries,
        totalBooks,
        totalIncrease,
        totalDecrease,
        totalBookRent,
      });

      const newPaighamDigest = new IlaqaDigestModel({
        totalReceived,
        manualReceived,
        receivedSum,
        totalSold,
        manualSold,
        soldSum,
        monthlyReceivingGoal,
        manualMonthlyReceivingGoal,
        monthlyReceivingGoalSum,
      });
      const newRsd = new RozShabBedariModel({
        umeedwaranFilled: uploadedUmeedwaran,
        manualUmeedwaran,
        umeedwaranFilledSum,
        manualRafaqaFilled,
        rafaqaFilled: uploadedRafaqa,
        rafaqaFilledSum,
      });
      const newBaitulmal = new BaitulmalModel({
        monthlyIncome,
        monthlyExpenditure,
        savings,
        loss,
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
      const newIlaqaReport = new IlaqaReportModel({
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
        baitulmalId: baitId?._id,
      });
      await newIlaqaReport.save();
      await auditLogger(
        user,
        "ILAQA_REPORT_CREATED",
        "A user Created Ilaqa report",
        req
      );
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
    const { areaId } = req?.query;
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
      const inset = parseInt(req.query.inset) || 0;
      const offset = parseInt(req.query.offset) || 10;
      const year = req.query.year;
      const month = req.query.month;
      let startDate = new Date(Date.UTC(year, month - 1, 1));
      if (areaId) {
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
          halqaAreaId: accessList,
          month: {
            $gte: formattedFirstDay,
            $lte: formattedLastDay,
          },
        };
        reports = await HalqaReportModel.find(ilaqaQuery)
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
              },
            },
          ])
          .sort({ createdAt: -1 });
      } else {
        if (year && month) {
          reports = await IlaqaReportModel.find({
            ilaqaAreaId: accessList,
            month: startDate,
          }).populate({ path: "ilaqaAreaId" });
        } else {
          reports = await IlaqaReportModel.find({
            ilaqaAreaId: accessList,
          })
            .select("_id")
            .sort({ createdAt: -1 });

          if (reports.length > 0) {
            reports = await IlaqaReportModel.find({
              ilaqaAreaId: accessList,
            })
              .populate([
                { path: "userId", select: ["_id", "email", "name", "age"] },
                {
                  path: "ilaqaAreaId",
                  populate: { path: "maqam" },
                },
              ])
              .sort({ createdAt: -1 })
              .skip(inset)
              .limit(offset);
          }
        }
      }
      let total = await IlaqaReportModel.find({
        ilaqaAreaId: accessList,
      });
      const totalReport = total.length;
      reports = { data: reports, length: totalReport };
      return this.sendResponse(req, res, {
        data: reports,
        message: "Reports fetched successfully",
      });
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
        report = await IlaqaReportModel.findOne({
          ilaqaAreaId: _id,
          month: date,
        }).populate({ path: "ilaqaAreaId" });
        if (!report) {
          return this.sendResponse(req, res, {
            message: "Report not found",
            status: 400,
          });
        }
      } else {
        report = await IlaqaReportModel.findOne({ _id }).populate([
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
          { path: "baitulmalId" },
          { path: "rsdId" },
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
      const {
        uploadedUmeedwaran,
        manualUmeedwaran,
        umeedwaranFilledSum,
        manualRafaqaFilled,
        uploadedRafaqa,
        rafaqaFilledSum,
      } = req.body;
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
      const isExist = await IlaqaReportModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Report not found",
          status: 404,
        });
      }
      const mentionedActivity = isExist?.mentionedActivityId;
      const rsdId = isExist?.rsdId;
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
        "baitulmalId",
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
          "totalReceived",
          "manualReceived",
          "receivedSum",
          "totalSold",
          "manualSold",
          "soldSum",
          "monthlyReceivingGoal",
          "manualMonthlyReceivingGoal",
          "monthlyReceivingGoalSum",
        ],
        tdId: [
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
          "registered",
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
            return IlaqaDigestModel;
          case "rsdId":
            return RozShabBedariModel;
          case "tdId":
            return MuntakhibTdModel;
          case "otherActivityId":
            return OtherActivitiesModel;
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
      // update studyCircle of ilaqa
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
      // update RsdId of ilaqa
      await RozShabBedariModel.findOneAndUpdate(
        {
          _id: rsdId,
        },
        {
          $set: {
            umeedwaranFilled: uploadedUmeedwaran,
            manualUmeedwaran: manualUmeedwaran,
            umeedwaranFilledSum: umeedwaranFilledSum,
            rafaqaFilled: uploadedRafaqa,
            manualRafaqaFilled: manualRafaqaFilled,
            rafaqaFilledSum: rafaqaFilledSum,
          },
        }
      );

      // Update the DivisionReportModel
      const ilaqaReportModel = await IlaqaReportModel.updateOne(
        { _id },
        { $set: dataToUpdate }
      );

      if (ilaqaReportModel?.modifiedCount > 0) {
        await auditLogger(
          userExist,
          "ILAQA_REPORT_UPDATED",
          "A user Updated Ilaqa report",
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
      accessList.push(id);
      const ilaqaReports = await IlaqaReportModel.find({
        month: {
          $gte: startDate,
          $lte: endDate,
        },
        ilaqaAreaId: accessList,
      }).populate("ilaqaAreaId userId");
      const allIlaqas = await IlaqaModel.find({ _id: accessList });
      const ilaqaReportsAreaIds = ilaqaReports.map((i) =>
        i?.ilaqaAreaId?._id?.toString()
      );
      const allIlaqaAreaIds = allIlaqas.map((i) => i?._id?.toString());
      const unfilledArr = [];
      allIlaqaAreaIds.forEach((i, index) => {
        if (!ilaqaReportsAreaIds.includes(i)) {
          unfilledArr.push(i);
        }
      });
      const unfilled = await IlaqaModel.find({ _id: unfilledArr });
      return this.sendResponse(req, res, {
        message: "Reports data fetched successfully",
        status: 200,
        data: {
          unfilled: unfilled,
          totalIlaqa: allIlaqaAreaIds?.length,
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
