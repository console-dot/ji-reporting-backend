const { decode } = require("jsonwebtoken");
const {
  WorkerInfoModel,
  HalqaActivityModel,
  OtherActivitiesModel,
  ToseeDawatModel,
  HalqaLibraryModel,
  RozShabBedariModel,
  HalqaReportModel,
  BaitulmalModel,
} = require("../../model/reports");
const { months, getRoleFlow } = require("../../utils");
const Response = require("../Response");
const { UserModel, HalqaModel } = require("../../model");

const isDataComplete = (dataToUpdate) => {
  const requiredKeys = [
    "anyOther",
    "arkan",
    "bookRent",
    "books",
    "comments",
    "commonLiteratureDistribution",
    "commonStudentMeetings",
    "current",
    "darseQuran",
    "dawatiWafud",
    "decrease",
    "hadithCircle",
    "ijtKarkunan",
    "ijtRafaqa",
    "increase",
    "karkunan",
    "literatureDistribution",
    "loss",
    "meetings",
    "month",
    "monthlyExpenditure",
    "monthlyIncome",
    "nizamSalah",
    "paighamEvent",
    "rafaqa",
    "rafaqaFilled",
    "rawabitDecided",
    "rawabitParties",
    "rwabitMeetingsGoal",
    "savings",
    "shabBedari",
    "shaheenMeeting",
    "studyCircle",
    "umeedWaran",
    "umeedwaranFilled",
  ];

  const missingKeys = requiredKeys.filter((key) => !(key in dataToUpdate));

  if (missingKeys.length > 0) {
    console.log("Missing keys:", missingKeys.join(", "));
    return false;
  }
  return true;
};

class HalqaReport extends Response {
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
      let user = await UserModel.findOne({ _id: userId });
      if (user?.nazim !== "halqa") {
        return this.sendResponse(req, res, {
          message: "Access denied",
          status: 401,
        });
      }
      const {
        anyOther,
        arkan,
        bookRent,
        books,
        comments,
        commonLiteratureDistribution,
        commonStudentMeetings,
        current,
        darseQuran,
        dawatiWafud,
        decrease,
        hadithCircle,
        ijtKarkunan,
        ijtRafaqa,
        increase,
        karkunan,
        literatureDistribution,
        loss,
        meetings,
        month,
        monthlyExpenditure,
        monthlyIncome,
        nizamSalah,
        paighamEvent,
        rafaqa,
        rafaqaFilled,
        rawabitDecided,
        rawabitParties,
        rwabitMeetingsGoal,
        registeredTosee,
        registeredLibrary,
        savings,
        shabBedari,
        shaheenMeeting,
        studyCircle,
        umeedWaran,
        umeedwaranFilled,
      } = req.body;
      if (!isDataComplete(req.body)) {
        return this.sendResponse(req, res, {
          message: "All fields are required",
          status: 400,
        });
      }
      const monthDate = new Date(req?.body.month);
      const { yearExist, monthExist } = {
        yearExist: monthDate.getFullYear(),
        monthExist: monthDate.getMonth(),
      };
      const reportExist = await HalqaReportModel.findOne({
        month: {
          $gte: new Date(yearExist, monthExist, 1),
          $lt: new Date(yearExist, monthExist + 1, 1),
        },
        halqaAreaId: user?.userAreaId,
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
      const newWI = new WorkerInfoModel({
        arkan,
        umeedWaran,
        rafaqa,
        karkunan,
      });
      ijtRafaqa.registered = ijtRafaqa.registered ? true : false;
      const newHalqaActivity = new HalqaActivityModel({
        ijtRafaqa,
        ijtKarkunan,
        studyCircle,
        darseQuran,
        shaheenMeeting,
        paighamEvent,
      });
      const newOtherActivity = new OtherActivitiesModel({
        dawatiWafud,
        rawabitParties,
        hadithCircle,
        nizamSalah,
        shabBedari,
        anyOther,
      });
      const newTD = new ToseeDawatModel({
        rawabitDecided,
        current,
        meetings,
        literatureDistribution,
        commonStudentMeetings,
        commonLiteratureDistribution,
        rwabitMeetingsGoal,
        registered: registeredTosee ? true : false,
      });
      const newHalqaLib = new HalqaLibraryModel({
        books,
        increase,
        decrease,
        bookRent,
        registered: registeredLibrary ? true : false,
      });
      const newRSD = new RozShabBedariModel({
        umeedwaranFilled,
        rafaqaFilled,
      });
      const newBaitulmal = new BaitulmalModel({
        monthlyIncome,
        monthlyExpenditure,
        savings,
        loss,
      });
      const wi = await newWI.save();
      const halqaActivity = await newHalqaActivity.save();
      const otherActivity = await newOtherActivity.save();
      const td = await newTD.save();
      const halqaLib = await newHalqaLib.save();
      const rsd = await newRSD.save();
      const baitId = await newBaitulmal.save();
      const newHalqaReport = new HalqaReportModel({
        comments,
        month,
        userId,
        halqaAreaId: user?.userAreaId,
        wiId: wi._id,
        halqaActivityId: halqaActivity._id,
        otherActivityId: otherActivity._id,
        tdId: td._id,
        halqaLibId: halqaLib._id,
        baitulmalId: baitId?._id,
        rsdId: rsd._id,
      });
      await newHalqaReport.save();
      return this.sendResponse(req, res, {
        message: "Halqa Report Added",
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
      let total;
      const inset = parseInt(req.query.inset) || 0;
      const offset = parseInt(req.query.offset) || 10;
      const year = req.query.year;
      const month = req.query.month;
      console.log(year, month);
      const tab = req.query.tab;
      let allReports = await HalqaReportModel.find({
        halqaAreaId: accessList,
      })
        .populate([
          { path: "userId", select: ["_id", "email", "name", "age"] },
          {
            path: "halqaAreaId",
            populate: {
              path: "parentId",
            },
          },
        ])
        .sort({ createdAt: -1 });

      let startDate = new Date(Date.UTC(year, month - 1, 1)); // Start of the month (month is 0-indexed in JavaScript Date)

      if (tab && tab === "division") {
        if (year && month) {
          let g = await HalqaReportModel.find({
            halqaAreaId: accessList,
            month: startDate,
          }).populate({ path: "halqaAreaId" });
          reports = g.filter((i) => i?.halqaAreaId?.parentType === "Tehsil");
          total = reports;
        } else {
          const divHalqa = allReports.filter(
            (i) => i?.halqaAreaId?.parentType === "Tehsil"
          );
          reports = divHalqa.slice(inset, inset + offset);
          total = divHalqa;
        }
      } else if (tab && tab === "maqam") {
        if (year && month) {
          let g = await HalqaReportModel.find({
            halqaAreaId: accessList,
            month: startDate,
          }).populate({ path: "halqaAreaId" });
          reports = g.filter((i) => i?.halqaAreaId?.parentType === "Maqam");
          total = reports;
        } else {
          const divHalqa = allReports.filter(
            (i) => i?.halqaAreaId?.parentType === "Maqam"
          );
          reports = divHalqa.slice(inset, inset + offset);
          total = divHalqa;
        }
      } else if (tab && tab === "ilaqa") {
        if (year && month) {
          let g = await HalqaReportModel.find({
            halqaAreaId: accessList,
            month: startDate,
          }).populate({ path: "halqaAreaId" });
          reports = g.filter((i) => i?.halqaAreaId?.parentType === "Ilaqa");
          total = reports;
        } else {
          const divHalqa = allReports.filter(
            (i) => i?.halqaAreaId?.parentType === "Ilaqa"
          );
          reports = divHalqa.slice(inset, inset + offset);
          total = divHalqa;
        }
      } else {
        reports = await HalqaReportModel.find({
          halqaAreaId: accessList,
        })
          .populate([
            { path: "userId", select: ["_id", "email", "name", "age"] },
            {
              path: "halqaAreaId",
              populate: {
                path: "parentId",
              },
            },
          ])
          .sort({ createdAt: -1 })
          .skip(inset)
          .limit(offset);

        total = await HalqaReportModel.find({
          halqaAreaId: accessList,
        });
      }
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
    const token = req.headers.authorization;
    const _id = req?.params?.id;
    try {
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
      const user = await UserModel.findOne({ _id: userId });
      const { userAreaId: id, nazim: key } = user;
      const accessList = (await getRoleFlow(id, key)).map((i) => i.toString());
      const hr = await HalqaReportModel.findOne({ _id }).select("halqaAreaId");
      const halqaAreaId = hr?.halqaAreaId || "";
      if (!accessList.includes(halqaAreaId.toString())) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 401,
        });
      }
      let report;
      report = await HalqaReportModel.findOne({ _id }).populate([
        { path: "userId", select: ["_id", "email", "name", "age"] },
        { path: "wiId" },
        { path: "halqaActivityId" },
        { path: "otherActivityId" },
        { path: "tdId" },
        { path: "halqaLibId" },
        { path: "rsdId" },
        { path: "halqaAreaId" },
        { path: "baitulmalId" },
      ]);
      return this.sendResponse(req, res, {
        data: report,
        message: "Halqa Report fetched",
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
      const isExist = await HalqaReportModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Report not found",
          status: 404,
        });
      }
      if (isExist?.userId.toString() !== userId) {
        return this.sendResponse(req, res, {
          message: "Only the user who created can update",
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
        "wiId",
        "halqaActivityId",
        "halqaLibId",
        "rsdId",
        "tdId",
        "otherActivityId",
        "baitulmalId",
      ];

      const obj = {
        wiId: [
          "arkan",
          "umeedWaran",
          "rafaqa",
          "karkunan",
          "shaheen",
          "members",
          "registered",
        ],
        halqaActivityId: [
          "ijtRafaqa",
          "ijtKarkunan",
          "studyCircle",
          "darseQuran",
          "shaheenMeeting",
          "paighamEvent",
        ],
        halqaLibId: ["books", "increase", "decrease", "bookRent", "registered"],
        rsdId: ["umeedwaranFilled", "rafaqaFilled"],
        baitulmalId: ["monthlyIncome", "monthlyExpenditure", "savings", "loss"],
        tdId: [
          "registered",
          "rawabitDecided",
          "current",
          "meetings",
          "literatureDistribution",
          "commonStudentMeetings",
          "commonLiteratureDistribution",
          "rwabitMeetingsGoal",
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
            if (key === "halqaLibId") {
              rs[element] = dataToUpdate["registeredLibrary"] ? true : false;
            }
          } else if (
            element === "umeedWaran" ||
            element === "rafaqa" ||
            element === "karkunan"
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
          case "wiId":
            return WorkerInfoModel;
          case "halqaActivityId":
            return HalqaActivityModel;
          case "halqaLibId":
            return HalqaLibraryModel;
          case "rsdId":
            return RozShabBedariModel;
          case "tdId":
            return ToseeDawatModel;
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

      // Update the DivisionReportModel
      const updatedHalqaReport = await HalqaReportModel.updateOne(
        { _id },
        { $set: dataToUpdate }
      );
      if (updatedHalqaReport?.modifiedCount > 0) {
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
      let startDate, endDate;

      if (queryDate) {
        const convert = new Date(queryDate);
        desiredYear = convert.getFullYear();
        desiredMonth = convert.getMonth();

        // Set startDate to the 1st of the provided month
        startDate = new Date(desiredYear, desiredMonth, 1);

        // Set endDate to the last day of the provided month
        endDate = new Date(desiredYear, desiredMonth + 1, 0);
      } else {
        const currentDate = new Date();
        desiredYear = currentDate.getFullYear();
        desiredMonth = currentDate.getMonth();

        // Set startDate to the 1st of the previous month
        startDate = new Date(desiredYear, desiredMonth, 1);

        // If the previous month is December, adjust the year
        if (desiredMonth === 0) {
          desiredYear -= 1;
        }

        // Set endDate to the 1st of the current month
        endDate = new Date(desiredYear, desiredMonth + 1, 1);
      }
      const halqaReports = await HalqaReportModel.find({
        month: {
          $gte: startDate,
          $lt: endDate,
        },
        halqaAreaId: accessList,
      }).populate("halqaAreaId userId");

      const allHalqas = await HalqaModel.find({ _id: accessList }).populate(
        "parentId"
      );
      const halqaReportsAreaIds = halqaReports.map((i) =>
        i?.halqaAreaId?._id?.toString()
      );
      const allHalqasAreaIds = allHalqas.map((i) => i?._id?.toString());
      const unfilledArr = [];
      allHalqasAreaIds.forEach((i, index) => {
        if (!halqaReportsAreaIds.includes(i)) {
          unfilledArr.push(i);
        }
      });
      const unfilled = await HalqaModel.find({ _id: unfilledArr }).populate(
        "parentId"
      );
      return this.sendResponse(req, res, {
        message: "Reports data fetched successfully",
        status: 200,
        data: {
          unfilled: unfilled,
          totalhalqa: allHalqasAreaIds?.length,
          allHalqas: allHalqas,
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

module.exports = HalqaReport;
