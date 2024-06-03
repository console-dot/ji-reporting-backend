const { decode } = require("jsonwebtoken");
const {
  WorkerInfoModel,
  ProvinceReportModel,
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
  DivisionReportModel,
  MaqamReportModel,
  BaitulmalModel,
} = require("../../model/reports");
const { months, getRoleFlow } = require("../../utils");
const Response = require("../Response");
const { UserModel, ProvinceModel } = require("../../model");

const isDataComplete = (dataToUpdate) => {
  const requiredKeys = [
    "tanzeemiRound",
    "divMushawarat",
    "ijtNazmeen",
    "month",
    "comments",
    "arkan",
    "umeedWaran",
    "rafaqa",
    "gift",
    "rwabitMeetingsGoal",
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
    "totalSoldMarket",
    "totalPrinted",
    "totalSoldTanzeemi",
    "umeedwaranFilled",
    "rafaqaFilled",
    "monthlyIncome",
    "monthlyExpenditure",
    "savings",
    "loss",
  ];

  const missingKeys = requiredKeys.filter((key) => !(key in dataToUpdate));
  if (missingKeys.length > 0) {
    console.log("Missing keys:", missingKeys.join(", "));
    return false;
  }
  return true;
};

class ProvinceReport extends Response {
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
      if (user?.nazim !== "province") {
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
        gift,
        karkunan,
        shaheen,
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
        rwabitMeetingsGoal,
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
        tarbiyatGaahGoalManual,
        current,
        meetings,
        literatureDistribution,
        commonStudentMeetings,
        commonLiteratureDistribution,
        totalLibraries,
        totalBooks,
        totalIncrease,
        totalDecrease,
        tarbiyatGaahHeldManual,
        tarbiyatGaahHeldSum,
        tarbiyatGaahGoalSum,
        totalBookRent,
        totalSoldMarket,
        totalPrinted,
        totalSoldTanzeemi,
        umeedwaranFilled,
        rafaqaFilled,
        registeredTosee,
        tarbiyatGaah,
        tarbiyatGaahGoal,
        tarbiyatGaahHeld,
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
      const reportExist = await ProvinceReportModel.findOne({
        month: {
          $gte: new Date(yearExist, monthExist, 1),
          $lt: new Date(yearExist, monthExist + 1, 1),
        },
        provinceAreaId: user?.userAreaId,
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
        tarbiyatGaahGoalManual,
        tarbiyatGaahHeldManual,
        tarbiyatGaahHeldSum,
        tarbiyatGaahGoalSum,
        tarbiyatGaah,
        tarbiyatGaahGoal,
        tarbiyatGaahHeld,
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
      const newPaighamDigest = new PaighamDigestModel({
        totalPrinted,
        totalSoldMarket,
        totalSoldTanzeemi,
        gift,
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
      const provinceTanzeem = await newMaqamTanzeem.save();
      const mentionedActivity = await newMentionedActivity.save();
      const otherActivity = await newOtherActivity.save();
      const td = await newTd.save();
      const provinceDivisionLib = await newMaqamDivisionLib.save();
      const paighamDigest = await newPaighamDigest.save();
      const rsd = await newRsd.save();
      const baitId = await newBaitulmal.save();
      const newProvinceReport = new ProvinceReportModel({
        month,
        comments,
        userId,
        provinceAreaId: user?.userAreaId,
        provinceTanzeemId: provinceTanzeem?._id,
        provinceWorkerInfoId: wi._id,
        provinceActivityId: provinceActivity._id,
        mentionedActivityId: mentionedActivity._id,
        otherActivityId: otherActivity._id,
        tdId: td._id,
        provinceDivisionLibId: provinceDivisionLib?._id,
        paighamDigestId: paighamDigest?._id,
        rsdId: rsd._id,
        jamiaatId: jami?._id,
        collegesId: clg?._id,
        baitulmalId: baitId?._id,
      });
      await newProvinceReport.save();
      return this.sendResponse(req, res, {
        message: "Province Report Added",
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
      const { userAreaId: id, nazim: key } = user;
      const accessList = (await getRoleFlow(id, key)).map((i) => i.toString());
      let reports;
      const inset = parseInt(req.query.inset) || 0;
      const offset = parseInt(req.query.offset) || 10;
      const year = req.query.year;
      const month = req.query.month;
      let maqamReports;
      let divisionReports;
      // RETURNING THE POPILATED HALQA REPORTS OF THE SPECIFIC DIVISION
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
        const divisionQuery = {
          divisionAreaId: accessList,
          month: {
            $gte: formattedFirstDay,
            $lte: formattedLastDay,
          },
        };
        const maqamQuery = {
          maqamAreaId: accessList,
          month: {
            $gte: formattedFirstDay,
            $lte: formattedLastDay,
          },
        };
        divisionReports = await DivisionReportModel.find(divisionQuery)
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
        maqamReports = await MaqamReportModel.find(maqamQuery)
          .populate([
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
            { path: "collegesId" },
            { path: "jamiaatId" },
          ])
          .sort({ createdAt: -1 });
        reports = {
          maqamReports: maqamReports,
          divisionReports: divisionReports,
        };
      } else {
        if (year && month) {
          let startDate = new Date(Date.UTC(year, month - 1, 1));
          reports = await ProvinceReportModel.find({
            provinceAreaId: accessList,
            month: startDate,
          }).populate({ path: "provinceAreaId" });
        } else {
          const existingReports = await ProvinceReportModel.find({
            provinceAreaId: accessList,
          });
          if (existingReports.length > 0) {
            reports = await ProvinceReportModel.find({
              provinceAreaId: accessList,
            })
              .populate([
                { path: "userId", select: ["_id", "email", "name", "age"] },
                { path: "provinceAreaId" },
              ])
              .sort({ createdAt: -1 })
              .skip(inset)
              .limit(offset);
          } else {
            reports = [];
          }
        }
      }
      let total = await ProvinceReportModel.find({
        provinceAreaId: accessList,
      });
      const totalReport = total.length;
      reports = {
        data: reports,
        length: totalReport,
        message: "Reports fetched successfully",
      };
      if (reports?.length > 0) {
        return this.sendResponse(req, res, {
          data: reports,
          message: "Reports fetched successfully",
        });
      } else {
        return this.sendResponse(req, res, {
          data: {
            maqamReports,
            divisionReports,
            message: "Reports fetched successfully",
          },
        });
      }
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
        report = await ProvinceReportModel.findOne({
          provinceAreaId: _id,
          month: date,
        }).populate({ path: "provinceAreaId" });
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
        const { provinceAreaId } = await ProvinceReportModel.findOne({
          _id,
        }).select("provinceAreaId");
        if (!accessList.includes(provinceAreaId.toString())) {
          return this.sendResponse(req, res, {
            message: "Access Denied",
            status: 401,
          });
        }
        report = await ProvinceReportModel.findOne({ _id }).populate([
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
          { path: "baitulmalId" },
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
      const isExist = await ProvinceReportModel.findOne({ _id });
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
        "provinceTanzeemId",
        "provinceWorkerInfoId",
        "provinceActivityId",
        "mentionedActivityId",
        "otherActivityId",
        "tdId",
        "provinceDivisionLibId",
        "paighamDigestId",
        "rsdId",
        "collegesId",
        "jamiaatId",
        "baitulmalId",
      ];

      const obj = {
        provinceTanzeemId: [
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
        provinceWorkerInfoId: [
          "arkan",
          "umeedWaran",
          "rafaqa",
          "karkunan",
          "shaheen",
          "members",
        ],
        provinceActivityId: [
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
        provinceDivisionLibId: [
          "totalLibraries",
          "totalBooks",
          "totalIncrease",
          "totalDecrease",
          "totalBookRent",
        ],
        paighamDigestId: [
          "totalPrinted",
          "totalSoldTanzeemi",
          "totalSoldMarket",
          "gift",
        ],
        rsdId: ["umeedwaranFilled", "rafaqaFilled"],
        tdId: [
          "registered",
          "commonLiteratureDistribution",
          "commonStudentMeetings",
          "literatureDistribution",
          "meetings",
          "rwabitMeetingsGoal",
          "current",
          "rawabitDecided",
        ],
        otherActivityId: [
          "dawatiWafud",
          "rawabitParties",
          "nizamSalah",
          "shabBedari",
          "anyOther",
          "tanzeemiRound",
          "tarbiyatGaahGoalManual",
          "tarbiyatGaahHeldManual",
          "tarbiyatGaahHeldSum",
          "tarbiyatGaahGoalSum",
          "tarbiyatGaah",
          "tarbiyatGaahGoal",
          "tarbiyatGaahHeld",
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
          case "provinceTanzeemId":
            return MaqamTanzeemModel;
          case "provinceWorkerInfoId":
            return MarkazWorkerInfoModel;
          case "provinceActivityId":
            return MaqamActivitiesModel;
          case "mentionedActivityId":
            return MentionedActivitiesModel;
          case "provinceDivisionLibId":
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

      // Update the DivisionReportModel
      const updatedProvinceReport = await ProvinceReportModel.updateOne(
        { _id },
        { $set: dataToUpdate }
      );

      if (updatedProvinceReport?.modifiedCount > 0) {
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

      const provinceReports = await ProvinceReportModel.find({
        month: {
          $gte: startDate,
          $lte: endDate,
        },
        provinceAreaId: accessList,
      }).populate("provinceAreaId userId");
      const allProvinces = await ProvinceModel.find({ _id: accessList });
      const provinceReportsAreaIds = provinceReports.map((i) =>
        i?.provinceAreaId?._id?.toString()
      );
      const allProvincesAreaIds = allProvinces.map((i) => i?._id?.toString());
      const unfilledArr = [];
      allProvincesAreaIds.forEach((i, index) => {
        if (!provinceReportsAreaIds.includes(i)) {
          unfilledArr.push(i);
        }
      });
      const unfilled = await ProvinceModel.find({ _id: unfilledArr });
      return this.sendResponse(req, res, {
        message: "Reports data fetched successfully",
        status: 200,
        data: {
          unfilled: unfilled,
          totalprovince: allProvincesAreaIds?.length,
          allProvince: allProvinces,
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

module.exports = ProvinceReport;
