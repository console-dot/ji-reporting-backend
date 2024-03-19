const {
  UserModel,
  ItaatNazmModel,
  StudiesModel,
  ToseeDawaModel,
  UmeedwarModel,
} = require("../model");
const { PrayersModel } = require("../model/prayers");
const { months, getRoleFlow } = require("../utils");
const Response = require("./Response");
const { decode } = require("jsonwebtoken");

class Umeedwar extends Response {
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
      if (!user)
        return this.sendResponse(req, res, {
          message: "User does not exist!",
          status: 404,
        });

      const {
        month,
        comments,
        aanat,
        ahdeesBook,
        ahdeesTotalDays,
        attended,
        attendedStudyCircle,
        disturbingRoutine,
        fajarInfradi,
        fajarOnTime,
        fajarQaza,
        fajarTotal,
        genralStudentsCount,
        genralStudentsTotalLitratureDivided,
        genralStudentsTotalMeetups,
        hifzSurah,
        hifzTotalDays,
        institutionAttendance,
        litratureBook,
        litratureTotalDays,
        otherPrayersInfradi,
        otherPrayersOnTime,
        otherPrayersQaza,
        otherPrayersTotal,
        rbt1Name,
        rbt1Mobile,
        rbt1BookRead,
        rbt1SurahHifz,
        rbt1SurahTafseer,
        rbt1TotalVisitings,
        rbt1NamazCondition,
        rbt1Programs,
        rbt2Name,
        rbt2Mobile,
        rbt2BookRead,
        rbt2SurahHifz,
        rbt2SurahTafseer,
        rbt2TotalVisitings,
        rbt2NamazCondition,
        rbt2Programs,
        rbt3Name,
        rbt3Mobile,
        rbt3BookRead,
        rbt3SurahHifz,
        rbt3SurahTafseer,
        rbt3TotalVisitings,
        rbt3NamazCondition,
        rbt3Programs,
        tafseerSurah,
        tafseerTotalDays,
        tafseerTotalRakoo,
      } = req.body;
      if (
        !month ||
        !comments ||
        !aanat ||
        !ahdeesBook ||
        !ahdeesTotalDays ||
        !attended ||
        !attendedStudyCircle ||
        !disturbingRoutine ||
        !fajarInfradi ||
        !fajarOnTime ||
        !fajarQaza ||
        !fajarTotal ||
        !genralStudentsCount ||
        !genralStudentsTotalLitratureDivided ||
        !genralStudentsTotalMeetups ||
        !hifzSurah ||
        !hifzTotalDays ||
        !institutionAttendance ||
        !litratureBook ||
        !litratureTotalDays ||
        !otherPrayersInfradi ||
        !otherPrayersOnTime ||
        !otherPrayersQaza ||
        !otherPrayersTotal ||
        !tafseerSurah ||
        !tafseerTotalDays ||
        !tafseerTotalRakoo ||
        !rbt1Name ||
        !rbt1Mobile ||
        !rbt1BookRead ||
        !rbt1SurahHifz ||
        !rbt1SurahTafseer ||
        !rbt1TotalVisitings ||
        !rbt1NamazCondition ||
        !rbt2Name ||
        !rbt2Mobile ||
        !rbt2BookRead ||
        !rbt2SurahHifz ||
        !rbt2SurahTafseer ||
        !rbt2TotalVisitings ||
        !rbt2NamazCondition ||
        !rbt3Name ||
        !rbt3Mobile ||
        !rbt3BookRead ||
        !rbt3SurahHifz ||
        !rbt3SurahTafseer ||
        !rbt3TotalVisitings ||
        !rbt3NamazCondition
      ) {
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
      const reportExist = await UmeedwarModel.findOne({
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
      const newPrayer = PrayersModel({
        otherNamaz: {
          otherPrayersInfradi,
          otherPrayersOnTime,
          otherPrayersQaza,
          otherPrayersTotal,
        },
        namazFajar: {
          fajarInfradi,
          fajarOnTime,
          fajarQaza,
          fajarTotal,
        },
      });
      const newStudies = StudiesModel({
        tafseerQuran: {
          tafseerSurah,
          tafseerTotalDays,
          tafseerTotalRakoo,
        },
        ahdees: {
          ahdeesBook,
          ahdeesTotalDays,
        },
        litrature: {
          litratureBook,
          litratureTotalDays,
        },
        hifz: { hifzSurah, hifzTotalDays },
        institutionAttendance,
      });
      const newItatNazm = ItaatNazmModel({
        aanat,
        attendedStudyCircle,
        attended,
      });

      const newTosee = ToseeDawaModel({
        rawabit: [
          {
            name: rbt1Name,
            mobile: rbt1Mobile,
            bookRead: rbt1BookRead,
            surahHifz: rbt1SurahHifz,
            surahTafseer: rbt1SurahTafseer,
            totalVisitings: rbt1TotalVisitings,
            namazCondition: rbt1NamazCondition,
            programs: rbt1Programs,
          },
          {
            name: rbt2Name,
            mobile: rbt2Mobile,
            bookRead: rbt2BookRead,
            surahHifz: rbt2SurahHifz,
            surahTafseer: rbt2SurahTafseer,
            totalVisitings: rbt2TotalVisitings,
            namazCondition: rbt2NamazCondition,
            programs: rbt2Programs,
          },
          {
            name: rbt3Name,
            mobile: rbt3Mobile,
            bookRead: rbt3BookRead,
            surahHifz: rbt3SurahHifz,
            surahTafseer: rbt3SurahTafseer,
            totalVisitings: rbt3TotalVisitings,
            namazCondition: rbt3NamazCondition,
            programs: rbt3Programs,
          },
        ],
        regularStudents: {
          genralStudentsCount,
          genralStudentsTotalLitratureDivided,
          genralStudentsTotalMeetups,
        },
      });
      const prayerId = await newPrayer.save();
      const toseeId = await newTosee.save();
      const itatId = await newItatNazm.save();
      const studyId = await newStudies.save();
      const newKhaka = UmeedwarModel({
        comments,
        month,
        userId,
        disturbingRoutine,

        studiesId: studyId?._id,
        toseeDawaId: toseeId?._id,
        itaatNazmId: itatId?._id,
        prayersId: prayerId?._id,
        areaId: user?.userAreaId,
        areaRef: user.userAreaType,
      });
      await newKhaka.save();
      return this.sendResponse(req, res, {
        message: "Personal report is created",
        status: 200,
      });
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal server error",
        status: 500,
      });
    }
  };
  getUmeedWarReports = async (req, res) => {
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
      if (!user) {
        return this.sendResponse(req, res, {
          message: "User does not exist!",
          status: 404,
        });
      }
      const reports = await UmeedwarModel.find({ areaId: accessList })
        .populate([
          {
            path: "prayersId",
          },
          {
            path: "studiesId",
          },
          {
            path: "toseeDawaId",
          },
          {
            path: "itaatNazmId",
          },
          {
            path: "userId",
          },
          {
            path: "areaId",
          },
        ])
        .sort({ createdAt: -1 });
      return this.sendResponse(req, res, {
        message: "Personal reports are fetched!",
        status: 200,
        data: reports,
      });
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal server error!",
        status: 500,
      });
    }
  };
  getUmeedWarSingleReport = async (req, res) => {
    try {
      const token = req.headers.authorization;
      const id = req.params.id;
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
          message: "User does not exist!",
          status: 404,
        });
      }
      const report = await UmeedwarModel.findOne({ _id: id }).populate([
        {
          path: "prayersId",
        },
        {
          path: "studiesId",
        },
        {
          path: "toseeDawaId",
        },
        {
          path: "itaatNazmId",
        },
        {
          path: "userId",
        },
        {
          path: "areaId",
        },
      ]);
      return this.sendResponse(req, res, {
        message: "Personal report  fetched!",
        status: 200,
        data: report,
      });
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal server error!",
        status: 500,
      });
    }
  };
  updateUmeedwarReport = async (req, res) => {
    try {
      const {
        month,
        comments,
        aanat,
        ahdeesBook,
        ahdeesTotalDays,
        attended,
        attendedStudyCircle,
        disturbingRoutine,
        fajarInfradi,
        fajarOnTime,
        fajarQaza,
        fajarTotal,
        genralStudentsCount,
        genralStudentsTotalLitratureDivided,
        genralStudentsTotalMeetups,
        hifzSurah,
        hifzTotalDays,
        institutionAttendance,
        litratureBook,
        litratureTotalDays,
        otherPrayersInfradi,
        otherPrayersOnTime,
        otherPrayersQaza,
        otherPrayersTotal,
        rbt1Name,
        rbt1Mobile,
        rbt1BookRead,
        rbt1SurahHifz,
        rbt1SurahTafseer,
        rbt1TotalVisitings,
        rbt1NamazCondition,
        rbt1Programs,
        rbt2Name,
        rbt2Mobile,
        rbt2BookRead,
        rbt2SurahHifz,
        rbt2SurahTafseer,
        rbt2TotalVisitings,
        rbt2NamazCondition,
        rbt2Programs,
        rbt3Name,
        rbt3Mobile,
        rbt3BookRead,
        rbt3SurahHifz,
        rbt3SurahTafseer,
        rbt3TotalVisitings,
        rbt3NamazCondition,
        rbt3Programs,
        tafseerSurah,
        tafseerTotalDays,
        tafseerTotalRakoo,
      } = req.body;

      const token = req.headers.authorization;
      const id = req.params.id;
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
          message: "User does not exist!",
          status: 404,
        });
      }
      const isExist = await UmeedwarModel.findOne({ _id: id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Report not found",
          status: 404,
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
      const obj = {
        itaatNazmId: { aanat, attendedStudyCircle, attended },
        prayersId: {
          namazFajar: {
            fajarInfradi,
            fajarOnTime,
            fajarQaza,
            fajarTotal,
          },
          otherNamaz: {
            otherPrayersInfradi,
            otherPrayersOnTime,
            otherPrayersQaza,
            otherPrayersTotal,
          },
        },
        toseeDawaId: {
          rawabit: [
            {
              name: rbt1Name,
              mobile: rbt1Mobile,
              bookRead: rbt1BookRead,
              surahHifz: rbt1SurahHifz,
              surahTafseer: rbt1SurahTafseer,
              totalVisitings: rbt1TotalVisitings,
              namazCondition: rbt1NamazCondition,
              programs: rbt1Programs,
            },
            {
              name: rbt2Name,
              mobile: rbt2Mobile,
              bookRead: rbt2BookRead,
              surahHifz: rbt2SurahHifz,
              surahTafseer: rbt2SurahTafseer,
              totalVisitings: rbt2TotalVisitings,
              namazCondition: rbt2NamazCondition,
              programs: rbt2Programs,
            },
            {
              name: rbt3Name,
              mobile: rbt3Mobile,
              bookRead: rbt3BookRead,
              surahHifz: rbt3SurahHifz,
              surahTafseer: rbt3SurahTafseer,
              totalVisitings: rbt3TotalVisitings,
              namazCondition: rbt3NamazCondition,
              programs: rbt3Programs,
            },
          ],
          regularStudents: {
            genralStudentsCount,
            genralStudentsTotalLitratureDivided,
            genralStudentsTotalMeetups,
          },
        },
        studiesId: {
          institutionAttendance: institutionAttendance,
          hifz: { hifzSurah, hifzTotalDays },
          litrature: { litratureBook, litratureTotalDays },
          ahdees: { ahdeesBook, ahdeesTotalDays },
          tafseerQuran: { tafseerSurah, tafseerTotalDays, tafseerTotalRakoo },
        },
      };
      const temp = Object.keys(obj);
      const report = await UmeedwarModel.findOne({ _id: id });
      const getModel = (title) => {
        switch (title) {
          case "itaatNazmId":
            return ItaatNazmModel;
          case "prayersId":
            return PrayersModel;
          case "toseeDawaId":
            return ToseeDawaModel;
          case "studiesId":
            return StudiesModel;
          default:
            break;
        }
        return null;
      };
      for (let i = 0; i < temp?.length; i++) {
        if (getModel(temp[i])) {
          const update = await getModel(temp[i]).updateOne(
            { _id: report[temp[i]] },
            { $set: obj[temp[i]] }
          );
        }
      }
      const update = await UmeedwarModel.updateOne(
        { _id: id },
        {
          $set: {
            month,
            comments,
            disturbingRoutine,
          },
        }
      );

      return this.sendResponse(req, res, {
        message: "Report is update!",
        status: 201,
      });
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal server error!",
        status: 500,
      });
    }
  };
}
module.exports = Umeedwar;
