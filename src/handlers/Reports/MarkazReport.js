const { decode } = require("jsonwebtoken");
const {
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
  MarkazWorkerInfoModel,
  MarkazReportModel,
  ProvinceReportModel,
  BaitulmalModel,
} = require("../../model/reports");
const { months, getRoleFlow } = require("../../utils");
const Response = require("../Response");
const {
  UserModel,
  ProvinceModel,
  CountryModel,
  HalqaModel,
  IlaqaModel,
  MaqamModel,
  DivisionModel,
} = require("../../model");
const { auditLogger } = require("../../middlewares/auditLogger");

const isDataComplete = (dataToUpdate) => {
  const requiredKeys = [
    "ijtNazmeen",
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
    "current",
    "meetings",
    "literatureDistribution",
    "commonStudentMeetings",
    "commonLiteratureDistribution",
    "totalLibraries",
    "totalBooks",
    "totalIncrease",
    "totalDecrease",
    "totalBookRent",
    "umeedwaranFilled",
    "rafaqaFilled",
    "divMushawarat",
    "tarbiyatGaah",
    "tarbiyatGaahGoal",
    "tarbiyatGaahGoalManual",
    "tarbiyatGaahGoalSum",
    "tarbiyatGaahHeld",
    "tarbiyatGaahHeldManual",
    "tarbiyatGaahHeldSum",
    "monthlyIncome",
    "monthlyExpenditure",
    "savings",
    "loss",
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
    console.log("Missing keys:", missingKeys.join(", "));
    return false;
  }
  return true;
};

class MarkazReport extends Response {
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
      if (user?.nazim !== "country") {
        return this.sendResponse(req, res, {
          message: "Access denied",
          status: 401,
        });
      }
      if (!isDataComplete(req.body)) {
        return this.sendResponse(req, res, {
          message: "All fields are required",
          status: 400,
        });
      }
      const {
        tanzeemiRound,
        divMushawarat,
        ijtNazmeen,
        month,
        comments,
        arkan,
        umeedWaran,
        rafaqa,
        karkunan,
        shaheen,
        rwabitMeetingsGoal,
        members,
        ijtArkan,
        studyCircle,
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
        umeedwaranFilled,
        rafaqaFilled,
        registeredTosee,
        tarbiyatGaah,
        tarbiyatGaahGoal,
        tarbiyatGaahGoalManual,
        tarbiyatGaahGoalSum,
        tarbiyatGaahHeld,
        tarbiyatGaahHeldManual,
        tarbiyatGaahHeldSum,
        jamiaatA,
        jamiaatB,
        jamiaatC,
        jamiaatD,
        jamiaatE,
        collegesA,
        collegesB,
        collegesC,
        collegesD,
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
      const reportExist = await MarkazReportModel.findOne({
        month: {
          $gte: new Date(yearExist, monthExist, 1),
          $lt: new Date(yearExist, monthExist + 1, 1),
        },
        countryAreaId: user?.userAreaId,
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
      const newWI = new MarkazWorkerInfoModel({
        arkan,
        umeedWaran,
        rafaqa,
        karkunan,
        shaheen,
        members,
      });
      ijtArkan.registered = ijtArkan?.registered ? true : false;
      studyCircle.registered = studyCircle?.registered ? true : false;
      ijtUmeedwaran.registered = ijtUmeedwaran?.registered ? true : false;
      sadurMeeting.registered = sadurMeeting?.registered ? true : false;
      const newMaqamActivity = new MaqamActivitiesModel({
        divMushawarat,
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
        tanzeemiRound,
        tarbiyatGaah,
        tarbiyatGaahGoal,
        tarbiyatGaahGoalManual,
        tarbiyatGaahGoalSum,
        tarbiyatGaahHeld,
        tarbiyatGaahHeldManual,
        tarbiyatGaahHeldSum,
      });
      const newTd = new ToseeDawatModel({
        rawabitDecided,
        current,
        meetings,
        rwabitMeetingsGoal,
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
      const newRsd = new RozShabBedariModel({
        umeedwaranFilled,
        rafaqaFilled,
      });
      const newBaitulmal = new BaitulmalModel({
        monthlyIncome,
        monthlyExpenditure,
        savings,
        loss,
      });
      const clg = await newColleges.save();
      const jami = await newJamiaat.save();
      const wi = await newWI.save();
      const provinceActivity = await newMaqamActivity.save();
      const markazTanzeem = await newMaqamTanzeem.save();
      const mentionedActivity = await newMentionedActivity.save();
      const otherActivity = await newOtherActivity.save();
      const td = await newTd.save();
      const markazDivisionLib = await newMaqamDivisionLib.save();
      const rsd = await newRsd.save();
      const baitId = await newBaitulmal.save();
      const newMarkazReport = new MarkazReportModel({
        month,
        comments,
        userId,
        countryAreaId: user?.userAreaId,
        markazTanzeemId: markazTanzeem?._id,
        markazWorkerInfoId: wi._id,
        markazActivityId: provinceActivity._id,
        mentionedActivityId: mentionedActivity._id,
        otherActivityId: otherActivity._id,
        tdId: td._id,
        markazDivisionLibId: markazDivisionLib?._id,
        rsdId: rsd._id,
        jamiaatId: jami?._id,
        collegesId: clg?._id,
        baitulmalId: baitId?._id,
      });
      await newMarkazReport.save();
      await auditLogger(
        user,
        "MARKAZ_REPORT_CREATED",
        "A user created Markaz report",
        req
      );
      return this.sendResponse(req, res, {
        message: "Markaz Report Added",
        status: 201,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message:
          "Error adding Markaz Report. Please try again. maybe some fields are missing",
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
      if (!user) {
        return this.sendResponse(req, res, {
          message: "User does not exist",
          status: 400,
        });
      }
      let reports;
      const inset = parseInt(req.query.inset) || 0;
      const offset = parseInt(req.query.offset) || 10;
      const year = req.query.year;
      const month = req.query.month;
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

        // Define the query
        const reportsQuery = {
          month: {
            $gte: formattedFirstDay,
            $lte: formattedLastDay,
          },
        };

        reports = await ProvinceReportModel.find(reportsQuery)
          .populate([
            { path: "userId", select: ["_id", "email", "name", "age"] },
            { path: "provinceAreaId" },
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
          ])
          .sort({ createdAt: -1 });
      } else {
        if (year && month) {
          let startDate = new Date(Date.UTC(year, month - 1, 1));
          reports = await MarkazReportModel.find({
            countryAreaId: user.userAreaId,
            month: startDate,
          }).populate({ path: "countryAreaId" });
        } else {
          const existingReports = await MarkazReportModel.find({})
            .select("_id")
            .sort({ createdAt: -1 });
          if (existingReports.length > 0) {
            reports = await MarkazReportModel.find({})
              .populate([
                { path: "userId", select: ["_id", "email", "name", "age"] },
                { path: "countryAreaId" },
              ])
              .sort({ createdAt: -1 })
              .skip(inset)
              .limit(offset);
          } else {
            // No reports found
            reports = [];
          }
        }
      }
      let total = await MarkazReportModel.find({
        countryAreaId: user.userAreaId,
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
        report = await MarkazReportModel.findOne({
          countryAreaId: _id,
          month: date,
        }).populate({ path: "countryAreaId" });
        if (!report) {
          return this.sendResponse(req, res, {
            message: "Report not found",
            status: 400,
          });
        }
      } else {
        report = await MarkazReportModel.findOne({ _id }).populate([
          { path: "userId", select: ["_id", "email", "name", "age"] },
          { path: "countryAreaId" },
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
        ]);
      }
      return this.sendResponse(req, res, {
        data: report,
        message: "Report fetched successfully",
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
      if (!isDataComplete(dataToUpdate)) {
        return this.sendResponse(req, res, {
          message: "All fields are required",
          status: 400,
        });
      }
      const isExist = await MarkazReportModel.findOne({ _id });
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
        "markazTanzeemId",
        "markazWorkerInfoId",
        "markazActivityId",
        "mentionedActivityId",
        "otherActivityId",
        "tdId",
        "markazDivisionLibId",
        "rsdId",
        "collegesId",
        "jamiaatId",
        "baitulmalId",
      ];

      const obj = {
        markazTanzeemId: [
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
        markazWorkerInfoId: [
          "arkan",
          "umeedWaran",
          "rafaqa",
          "karkunan",
          "shaheen",
          "members",
        ],
        markazActivityId: [
          "ijtArkan",
          "studyCircle",
          "ijtNazmeen",
          "ijtUmeedwaran",
          "sadurMeeting",
          "divMushawarat",
        ],
        mentionedActivityId: [
          "ijtRafaqa",
          "studyCircle",
          "ijtKarkunan",
          "darseQuran",
          "shaheenMeeting",
          "paighamEvent",
        ],
        markazDivisionLibId: [
          "totalLibraries",
          "totalBooks",
          "totalIncrease",
          "totalDecrease",
          "totalBookRent",
        ],
        rsdId: ["umeedwaranFilled", "rafaqaFilled"],
        tdId: [
          "registered",
          "commonLiteratureDistribution",
          "commonStudentMeetings",
          "literatureDistribution",
          "rwabitMeetingsGoal",
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
          "tarbiyatGaahGoal",
          "tarbiyatGaahGoalManual",
          "tarbiyatGaahGoalSum",
          "tarbiyatGaahHeld",
          "tarbiyatGaahHeldManual",
          "tanzeemiRound",
          "tarbiyatGaahHeldSum",
        ],
        baitulmalId: ["monthlyIncome", "monthlyExpenditure", "savings", "loss"],
        collegesId: ["collegesA", "collegesB", "collegesC", "collegesD"],
        jamiaatId: ["jamiaatA", "jamiaatB", "jamiaatC", "jamiaatD", "jamiaatE"],
      };

      const returnData = (arr, key) => {
        const rs = {};
        arr.forEach((element) => {
          if (element === "registered") {
            if (key === "tdId") {
              rs[element] = dataToUpdate["registeredTosee"] ? true : false;
            }
            if (key === "provinceWorkerInfoId") {
              rs[element] = dataToUpdate["registeredWorker"] ? true : false;
            }
          } else {
            rs[element] = dataToUpdate[element];
          }
        });

        return rs;
      };
      const returnModel = (i) => {
        switch (i) {
          case "markazTanzeemId":
            return MaqamTanzeemModel;
          case "markazWorkerInfoId":
            return MarkazWorkerInfoModel;
          case "markazActivityId":
            return MaqamActivitiesModel;
          case "mentionedActivityId":
            return MentionedActivitiesModel;
          case "markazDivisionLibId":
            return MaqamDivisionLibraryModel;
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
          case "baitulmalId":
            return BaitulmalModel;
          default:
            return null;
        }
      };

      for (let i = 0; i < refsToUpdate.length; i++) {
        try {
          await returnModel(refsToUpdate[i]).updateOne(
            { _id: isExist?.[refsToUpdate[i]] },
            { $set: returnData(obj[refsToUpdate[i]], refsToUpdate[i]) }
          );
        } catch (error) {
          console.log(error);
        }
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
      const updatedProvinceReport = await MarkazReportModel.updateOne(
        { _id },
        { $set: dataToUpdate }
      );

      if (updatedProvinceReport?.modifiedCount > 0) {
        await auditLogger(
          userExist,
          "MARKAZ_REPORT_UPDATED",
          "A user Updated Markaz report",
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

      const markazReports = await MarkazReportModel.find({
        month: {
          $gte: startDate,
          $lte: endDate,
        },
        countryAreaId: user?.userAreaId,
      }).populate("userId");
      const countries = await CountryModel.find({ _id: allChildAreaIDs });
      const markazReportsAreaIds = markazReports.map((i) =>
        i?.countryAreaId?._id?.toString()
      );
      const countryAreaId = countries.map((i) => i?._id?.toString());
      const unfilledArr = [];
      countryAreaId.forEach((i, index) => {
        if (!markazReportsAreaIds.includes(i)) {
          unfilledArr.push(i);
        }
      });
      const unfilled = await CountryModel.find({ _id: unfilledArr });
      return this.sendResponse(req, res, {
        message: "Reports data fetched successfully",
        status: 200,
        data: {
          unfilled: unfilled,
          totalCountries: countryAreaId?.length,
          allCountries: countries,
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

module.exports = MarkazReport;
