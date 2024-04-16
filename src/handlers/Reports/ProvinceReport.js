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
} = require("../../model/reports");
const { months, getRoleFlow } = require("../../utils");
const Response = require("../Response");
const { UserModel, ProvinceModel } = require("../../model");

const isDataComplete = ({
  arkanFilled,
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
  totalSoldMarket,
  totalPrinted,
  totalSoldTanzeemi,
  umeedwaranFilled,
  rafaqaFilled,
}) => {
  if (
    !arkanFilled ||
    !tanzeemiRound ||
    !divMushawarat ||
    !ijtNazmeen ||
    !month ||
    !comments ||
    !totalSoldMarket ||
    !totalSoldTanzeemi ||
    !arkan ||
    !umeedWaran ||
    !rafaqa ||
    !totalPrinted ||
    !karkunan ||
    !shaheen ||
    !members ||
    !ijtArkan ||
    !studyCircle ||
    !gift ||
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
    !umeedwaranFilled ||
    !rafaqaFilled ||
    !totalPrinted
  ) {
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
      const {
        arkanFilled,
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
        totalSoldMarket,
        totalPrinted,
        totalSoldTanzeemi,
        umeedwaranFilled,
        rafaqaFilled,
        registeredTosee,
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
        userId,
      });
      const reports = await ProvinceReportModel.findOne({
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
        totalPrinted,
        totalSoldMarket,
        totalSoldTanzeemi,
        gift,
      });
      const newRsd = new RozShabBedariModel({
        umeedwaranFilled,
        rafaqaFilled,
        arkanFilled,
      });
      const wi = await newWI.save();
      const provinceActivity = await newMaqamActivity.save();
      const provinceTanzeem = await newMaqamTanzeem.save();
      const mentionedActivity = await newMentionedActivity.save();
      const otherActivity = await newOtherActivity.save();
      const td = await newTd.save();
      const provinceDivisionLib = await newMaqamDivisionLib.save();
      const paighamDigest = await newPaighamDigest.save();
      const rsd = await newRsd.save();
      const newProvinceReport = new ProvinceReportModel({
        month,
        comments,
        userId,
        provinceAreaId: user?.userAreaId,
        provinceTanzeemId: provinceTanzeem?._id,
        wiId: wi._id,
        provinceActivityId: provinceActivity._id,
        mentionedActivityId: mentionedActivity._id,
        otherActivityId: otherActivity._id,
        tdId: td._id,
        provinceDivisionLibId: provinceDivisionLib?._id,
        paighamDigestId: paighamDigest?._id,
        rsdId: rsd._id,
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
      reports = await ProvinceReportModel.find({
        provinceAreaId: accessList,
      })
        .populate([
          { path: "userId", select: ["_id", "email", "name", "age"] },
          { path: "provinceAreaId" },
          { path: "provinceTanzeemId" },
          { path: "wiId" },
          { path: "provinceActivityId" },
          { path: "mentionedActivityId" },
          { path: "otherActivityId" },
          { path: "tdId" },
          { path: "provinceDivisionLibId" },
          { path: "paighamDigestId" },
          { path: "rsdId" },
        ])
        .sort({ createdAt: -1 });
      // } else {
      //   reports = await ProvinceReportModel.find().populate([
      //     { path: 'userId', select: ['_id', 'email', 'name', 'age'] },
      //     { path: 'provinceAreaId' },
      //     { path: 'provinceTanzeemId' },
      //     { path: 'wiId' },
      //     { path: 'provinceActivityId' },
      //     { path: 'mentionedActivityId' },
      //     { path: 'otherActivityId' },
      //     { path: 'tdId' },
      //     { path: 'provinceDivisionLibId' },
      //     { path: 'paighamDigestId' },
      //     { path: 'rsdId' },
      //   ]);
      // }
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
      const { provinceAreaId } = await ProvinceReportModel.findOne({
        _id,
      }).select("provinceAreaId");
      if (!accessList.includes(provinceAreaId.toString())) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 401,
        });
      }
      const reports = await ProvinceReportModel.findOne({ _id }).populate([
        { path: "userId", select: ["_id", "email", "name", "age"] },
        { path: "provinceAreaId" },
        { path: "provinceTanzeemId" },
        { path: "wiId" },
        { path: "provinceActivityId" },
        { path: "mentionedActivityId" },
        { path: "otherActivityId" },
        { path: "tdId" },
        { path: "provinceDivisionLibId" },
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
      const isExist = await ProvinceReportModel.findOne({ _id });
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
        "provinceTanzeemId",
        "wiId",
        "provinceActivityId",
        "mentionedActivityId",
        "otherActivityId",
        "tdId",
        "provinceDivisionLibId",
        "paighamDigestId",
        "rsdId",
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
        wiId: [
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
          case "provinceTanzeemId":
            return MaqamTanzeemModel;
          case "wiId":
            return WorkerInfoModel;
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
