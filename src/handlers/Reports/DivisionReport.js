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
  HalqaReportModel,
  BaitulmalModel,
} = require("../../model/reports");
const { months, getRoleFlow, getQueryDateRange } = require("../../utils");
const Response = require("../Response");
const {
  UserModel,
  DivisionModel,
  CountryModel,
  ProvinceModel,
  MaqamModel,
  IlaqaModel,
  HalqaModel,
} = require("../../model");
const { auditLogger } = require("../../middlewares/auditLogger");

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
      const reportExist = await DivisionReportModel.findOne({
        month: {
          $gte: new Date(yearExist, monthExist, 1),
          $lt: new Date(yearExist, monthExist + 1, 1),
        },
        divisionAreaId: user?.userAreaId,
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
      const newBaitulmal = new BaitulmalModel({
        monthlyIncome,
        monthlyExpenditure,
        savings,
        loss,
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
      const baitId = await newBaitulmal.save();
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
        baitulmalId: baitId?._id,
      });

      await newDivisionReport.save();
      await auditLogger(
        user,
        "DIVISION_REPORT_CREATED",
        "A user Created Division report",
        req
      );
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
      const { areaId } = req?.query;
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
        const reportsQuery = {
          halqaAreaId: allChildAreaIDs,
          month: {
            $gte: formattedFirstDay,
            $lte: formattedLastDay,
          },
        };
        reports = await HalqaReportModel.find(reportsQuery)
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
          reports = await DivisionReportModel.find({
            divisionAreaId: allChildAreaIDs,
            month: startDate,
          }).populate({ path: "divisionAreaId" });
        } else {
          reports = await DivisionReportModel.find({
            divisionAreaId: allChildAreaIDs,
          })
            .select("_id")
            .sort({ createdAt: -1 });

          if (reports.length > 0) {
            reports = await DivisionReportModel.find({
              divisionAreaId: allChildAreaIDs,
            })
              .populate([
                { path: "userId", select: ["_id", "email", "name", "age"] },
                { path: "divisionAreaId", populate: { path: "province" } },
              ])
              .sort({ createdAt: -1 })
              .skip(inset)
              .limit(offset);
          }
        }
      }
      let total = await DivisionReportModel.find({
        divisionAreaId: allChildAreaIDs,
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
      let report;
      if (!_id) {
        return this.sendResponse(req, res, {
          message: "Id is required",
          status: 404,
        });
      }
      if (date) {
        report = await DivisionReportModel.findOne({
          divisionAreaId: _id,
          month: date,
        }).populate({ path: "divisionAreaId" });
        if (!report) {
          return this.sendResponse(req, res, {
            message: "Report not found",
            status: 400,
          });
        }
      } else {
        report = await DivisionReportModel.findOne({ _id }).populate([
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
          { path: "baitulmalId" },
          { path: "rsdId" },
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
        "baitulmalId",
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
        paighamDigestId: ["totalReceived", "totalSold", "monthlyReceivingGoal"],
        rsdId: [
          "umeedwaranFilled",
          "manualUmeedwaran",
          "umeedwaranFilledSum",
          "manualRafaqaFilled",
          "rafaqaFilled",
          "rafaqaFilledSum",
        ],
        baitulmalId: ["monthlyIncome", "monthlyExpenditure", "savings", "loss"],
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
          case "baitulmalId":
            return BaitulmalModel;
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
      // update studyCircle of sssssdivision
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
        await auditLogger(
          userExist,
          "DIVISION_REPORT_UPDATED",
          "A user Updated Division report",
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
      const { userAreaId: id, userAreaType } = user;

      // Fetch user area based on the type
      const areaModels = {
        Country: CountryModel,
        Province: ProvinceModel,
        Division: DivisionModel,
        Maqam: MaqamModel,
        Ilaqa: IlaqaModel,
        Halqa: HalqaModel, // Default case
      };

      const userArea = await areaModels[userAreaType]?.findOne({ _id: id });

      if (!userArea) {
        return this.sendResponse(req, res, {
          message: "User area not found",
          status: 404,
        });
      }

      // Combine all child area IDs into a single array
      let allChildAreaIDs = [...(userArea.childDivisionIDs || [])];

      const { startDate, endDate } = getQueryDateRange(queryDate);

      allChildAreaIDs.push(id); // Add the user's area ID to the list

      // Aggregation pipeline to fetch reports and identify unfilled areas
      const divisionReports = await DivisionReportModel.aggregate([
        {
          $match: {
            month: { $gte: startDate, $lte: endDate },
            divisionAreaId: { $in: allChildAreaIDs },
          },
        },
        {
          $lookup: {
            from: "divisions", // Assuming 'divisions' is the collection name for DivisionModel
            localField: "divisionAreaId",
            foreignField: "_id",
            as: "divisionArea",
          },
        },
        {
          $unwind: "$divisionArea", // Flatten the divisionArea array
        },
        {
          $project: {
            _id: 1,
            divisionAreaId: 1,
          },
        },
      ]);

      const allDivisions = await DivisionModel.find({
        _id: { $in: allChildAreaIDs },
        disabled: false, // Ensure that disabled is false
      }).select("name _id province");

      // Create a set for fast lookup
      const divisionReportsAreaIds = new Set(
        divisionReports.map((i) => i?.divisionAreaId?._id?.toString())
      );
      const allDivisionsAreaIds = allDivisions.map((i) => i?._id?.toString());

      // Identify unfilled areas by comparing the two sets
      const unfilledArr = allDivisionsAreaIds.filter(
        (i) => !divisionReportsAreaIds.has(i)
      );

      // Fetch unfilled Divisions
      const unfilled = await DivisionModel.find({ _id: { $in: unfilledArr } });

      // Send response
      return this.sendResponse(req, res, {
        message: "Reports data fetched successfully",
        status: 200,
        data: {
          unfilled,
          totalDivision: allDivisionsAreaIds.length,
          allDivisions: allDivisions,
        },
      });
    } catch (error) {
      console.error(error);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
}

module.exports = DivisionReport;
