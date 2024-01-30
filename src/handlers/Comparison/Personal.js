const { UmeedwarModel } = require("../../model");
const jwt = require("jsonwebtoken");
const Response = require("../Response");

const months = [
  null,
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const response = {
  data: {
    labels: [],
    datasets: [],
  },
  status: 200,
};
class PersonalCompare extends Response {
  getRandomRGB = () => {
    const r = Math.floor(Math.random() * 256); // Random red value between 0 and 255
    const g = Math.floor(Math.random() * 256); // Random green value between 0 and 255
    const b = Math.floor(Math.random() * 256); // Random blue value between 0 and 255

    return `rgb(${r}, ${g}, ${b})`;
  };
  createPrayerReport = async (req, res) => {
    try {
      const token = req?.headers?.authorization;
      const { dates, duration_type } = req?.body;
      if (dates.length < 2) {
        return this.sendResponse(req, res, {
          message: "Atleast 2 dates required",
          status: 400,
        });
      }
      if (!token) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 400,
        });
      }
      const decoded = jwt.decode(token.split(" ")[1]);
      const userId = decoded?.id;
      const _id = userId;
      if (!_id) {
        return this.sendResponse(req, res, {
          message: "ID is required",
          status: 403,
        });
      }
      const labels = [];
      const datasets = [];
      for (let i of dates) {
        const bg = this.getRandomRGB();
        const sample = {
          label: duration_type === "month" ? `${months[i.month]} ${i.year}` : i,
          data: [],
          backgroundColor: bg,
          borderColor: bg,
          borderWidth: 1,
        };
        let sod, eod;
        if (duration_type === "month") {
          sod = new Date(`${i.month}-01-${i.year}`);
          eod = new Date(i.year, i.month);
        } else if (duration_type === "year") {
          sod = new Date(`01-01-${i}`);
          eod = new Date(`12-31-${i}`);
        } else {
          return this.sendResponse(req, res, {
            message: "Invalid duration type",
            status: 403,
          });
        }
        const report = await UmeedwarModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            userId: _id,
          },
          "prayersId"
        ).populate("prayersId");
        if (report.length > 0) {
          const keys = Object.keys(
            report[report.length - 1].prayersId._doc
          ).filter((i) => i !== "_id" && i !== "__v");
          keys.forEach((doc) => {
            if (report[report.length - 1].prayersId._doc[doc]) {
              sample.data.push(
                parseInt(
                  doc === "namazFajar"
                    ? report[report.length - 1].prayersId._doc[doc].fajarTotal
                    : report[report.length - 1].prayersId._doc[doc]
                        .otherPrayersTotal
                ),
                parseInt(
                  doc === "namazFajar"
                    ? report[report.length - 1].prayersId._doc[doc].fajarQaza
                    : report[report.length - 1].prayersId._doc[doc]
                        .otherPrayersQaza
                ),
                parseInt(
                  doc === "namazFajar"
                    ? report[report.length - 1].prayersId._doc[doc].fajarOnTime
                    : report[report.length - 1].prayersId._doc[doc]
                        .otherPrayersInfradi
                )
              );
              Object.keys(
                report[report.length - 1].prayersId._doc[doc]
              ).forEach((key) => {
                if (!labels.includes(key.toLowerCase())) {
                  labels.push(key.toLowerCase());
                }
              });
            }
          });
        }
        datasets.push(sample);
      }
      response.data.labels = labels;
      response.data.datasets = datasets;
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal server error",
        status: 500,
      });
    }
  };
  createStudiesReprt = async (req, res) => {
    try {
      const token = req?.headers?.authorization;
      const { dates, areaId, duration_type } = req?.body;
      if (dates.length < 2) {
        return this.sendResponse(req, res, {
          message: "Atleast 2 dates required",
          status: 400,
        });
      }
      if (!token) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 400,
        });
      }
      const decoded = jwt.decode(token.split(" ")[1]);
      const userId = decoded?.id;
      const _id = userId;
      if (!_id) {
        return this.sendResponse(req, res, {
          message: "ID is required",
          status: 403,
        });
      }
      const labels = [];
      const datasets = [];
      for (let i of dates) {
        const bg = this.getRandomRGB();
        const sample = {
          label: duration_type === "month" ? `${months[i.month]} ${i.year}` : i,
          data: [],
          backgroundColor: bg,
          borderColor: bg,
          borderWidth: 1,
        };
        let sod, eod;
        if (duration_type === "month") {
          sod = new Date(`${i.month}-01-${i.year}`);
          eod = new Date(i.year, i.month);
        } else if (duration_type === "year") {
          sod = new Date(`01-01-${i}`);
          eod = new Date(`12-31-${i}`);
        } else {
          return this.sendResponse(req, res, {
            message: "Dates are invalid",
            status: 403,
          });
        }
        const reports = await UmeedwarModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            userId: _id,
          },
          "studiesId"
        ).populate("studiesId");
        if (reports?.length > 0) {
          const keys = Object.keys(
            reports[reports?.length - 1]._doc.studiesId._doc
          ).filter((i) => i !== "_id" && i !== "__v");
          keys.forEach((doc) => {
            if (reports[reports?.length - 1]._doc?.studiesId._doc[doc]) {
              if (doc === "tafseerQuran") {
                sample.data.push(
                  parseInt(
                    reports[reports?.length - 1]._doc.studiesId._doc[doc]
                      .tafseerTotalRakoo
                  ),
                  parseInt(
                    reports[reports?.length - 1]._doc.studiesId._doc[doc]
                      .tafseerTotalDays
                  )
                );
              } else if (doc === "ahdees") {
                sample?.data.push(
                  parseInt(
                    reports[reports?.length - 1]._doc.studiesId._doc[doc]
                      .ahdeesTotalDays
                  )
                );
              } else if (doc === "litrature") {
                sample?.data.push(
                  parseInt(
                    reports[reports?.length - 1]._doc.studiesId._doc[doc]
                      .litratureTotalDays
                  )
                );
              } else if (doc === "hifz") {
                sample?.data.push(
                  parseInt(
                    reports[reports?.length - 1]._doc.studiesId._doc[doc]
                      .hifzTotalDays
                  )
                );
              } else {
                sample?.data.push(
                  parseInt(
                    reports[reports?.length - 1]._doc.studiesId._doc[doc]
                  )
                );
                labels.push(
                  Object.keys(
                    reports[reports?.length - 1]._doc.studiesId._doc
                  ).find((f) => f === "institutionAttendance")
                );
              }
              Object.keys(
                reports[reports?.length - 1]._doc.studiesId._doc[doc]
              ).forEach((key) => {
                const ex = [
                  "ahdeesbook",
                  "litraturebook",
                  "hifzsurah",
                  "tafseersurah",
                ];
                const lowerKey = key.toLowerCase();
                if (!ex.includes(lowerKey) && !labels.includes(lowerKey)) {
                  labels.push(lowerKey);
                }
              });
            }
          });
        }
        datasets.push(sample);
      }
      response.data.labels = labels;
      response.data.datasets = datasets;
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };

  toseeDawaReport = async (req, res) => {
    try {
      const token = req?.headers?.authorization;
      const { dates, duration_type } = req?.body;
      if (dates.length < 2) {
        return this.sendResponse(req, res, {
          message: "Atleast 2 dates required",
          status: 400,
        });
      }
      if (!token) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 400,
        });
      }
      const decoded = jwt.decode(token.split(" ")[1]);
      const userId = decoded?.id;
      const _id = userId;
      if (!_id) {
        return this.sendResponse(req, res, {
          message: "ID is required",
          status: 403,
        });
      }
      const labels = [];
      const datasets = [];
      for (let i of dates) {
        const bg = this.getRandomRGB();
        const sample = {
          label: duration_type === "month" ? `${months[i.month]} ${i.year}` : i,
          data: [],
          backgroundColor: bg,
          borderColor: bg,
          borderWidth: 1,
        };
        let sod, eod;
        if (duration_type === "month") {
          sod = new Date(`${i.month}-01-${i.year}`);
          eod = new Date(i.year, i.month);
        } else if (duration_type === "year") {
          sod = new Date(`01-01-${i}`);
          eod = new Date(`12-31-${i}`);
        } else {
          return this.sendResponse(req, res, {
            message: "Dates are invalid",
            status: 403,
          });
        }
        const reports = await UmeedwarModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            userId: _id,
          },
          "toseeDawaId"
        ).populate("toseeDawaId");
        if (reports?.length > 0) {
          const keys = Object.keys(
            reports[reports?.length - 1]._doc.toseeDawaId._doc
          ).filter((f) => f !== "_id" && f !== "__v");
          keys
            .filter((f) => f !== "rawabit")
            .forEach((doc) => {
              if (
                reports[reports?.length - 1]._doc.toseeDawaId.regularStudents
              ) {
                sample?.data?.push(
                  parseInt(
                    reports[reports?.length - 1]._doc.toseeDawaId
                      .regularStudents.genralStudentsCount
                  ),
                  parseInt(
                    reports[reports?.length - 1]._doc.toseeDawaId
                      .regularStudents.genralStudentsTotalLitratureDivided
                  ),
                  parseInt(
                    reports[reports?.length - 1]._doc.toseeDawaId
                      .regularStudents.genralStudentsTotalMeetups
                  )
                );
              }
              const item =
                reports[reports?.length - 1]._doc.toseeDawaId.regularStudents;
              Object.keys(item).forEach((key) => {
                if (!labels.includes(key.toLowerCase())) {
                  labels.push(key.toLowerCase());
                }
              });
            });
        }
        datasets.push(sample);
      }
      response.data.labels = labels;
      response.data.datasets = datasets;
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };

  main = (req, res) => {
    const property = req?.params?.property;
    switch (property) {
      case "prayers":
        this.createPrayerReport(req, res);
        break;
      case "studies":
        this.createStudiesReprt(req, res);
        break;
      case "toseeDawa":
        this.toseeDawaReport(req, res);
        break;
      default:
        return this.sendResponse(req, res, {
          message: "Select a valid property",
          status: 400,
        });
    }
  };
}

module.exports = { PersonalCompare };
