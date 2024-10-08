const { UserModel } = require("../../model");
const { Maqam, MaqamReportModel } = require("../../model/reports");
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
    colors: [],
    chart: "",
  },
  status: 200,
};
class MaqamCompare extends Response {
  getRandomRGB = () => {
    const r = Math.floor(Math.random() * 256); // Random red value between 0 and 255
    const g = Math.floor(Math.random() * 256); // Random green value between 0 and 255
    const b = Math.floor(Math.random() * 256); // Random blue value between 0 and 255

    return `rgb(${r}, ${g}, ${b})`;
  };
  // Function to calculate the percentage
  calculatePercentage = (achieved, goal) => {
    if (goal === 0) {
      return 0;
    }
    if (achieved > goal) {
      return 100;
    } else {
      return ((achieved / goal) * 100).toFixed(2);
    }
  };
  calculateProfitLossPercentage = (income, expenditure) => {
    if (income === 0) {
      return -100; // Indicate complete loss if there is no income
    }
    return (((income - expenditure) / income) * 100).toFixed(2);
  };
  maqamTanzeemReport = async (req, res) => {
    try {
      const property = req?.params?.property;
      const token = req?.headers?.authorization;
      const { dates, areaId, duration_type } = req?.body;
      if (dates?.length < 2 && property !== "radialChart") {
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
        const report = await MaqamReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            maqamAreaId: areaId,
          },
          "maqamTanzeemId"
        ).populate("maqamTanzeemId");
        if (report?.length > 0) {
          const keys = Object.keys(
            report[report?.length - 1].maqamTanzeemId._doc
          ).filter((key) => key !== "_id" && key !== "__v");
          if (property === "spiderChart" || property === "radialChart") {
            keys.forEach((doc) => {
              if (report[report?.length - 1].maqamTanzeemId._doc[doc]) {
                sample.data.push(
                  this.calculatePercentage(
                    parseInt(
                      report[report?.length - 1].maqamTanzeemId._doc[doc]._doc
                        .start
                    ) +
                      parseInt(
                        report[report?.length - 1].maqamTanzeemId._doc[doc]._doc
                          .increase
                      ) -
                      parseInt(
                        report[report?.length - 1].maqamTanzeemId._doc[doc]._doc
                          .decrease
                      ),
                    report[report?.length - 1].maqamTanzeemId._doc[doc]._doc
                      .monthly
                  )
                );
                if (!labels.includes(doc.toLowerCase())) {
                  labels.push(doc.toLowerCase());
                }
              }
            });
          } else {
            keys.forEach((doc) => {
              if (report[report?.length - 1].maqamTanzeemId._doc[doc]) {
                sample.data.push(
                  parseInt(
                    report[report?.length - 1].maqamTanzeemId._doc[doc]._doc
                      .start
                  ) +
                    parseInt(
                      report[report?.length - 1].maqamTanzeemId._doc[doc]._doc
                        .increase
                    ) -
                    parseInt(
                      report[report?.length - 1].maqamTanzeemId._doc[doc]._doc
                        .decrease
                    )
                );
                if (!labels.includes(doc.toLowerCase())) {
                  labels.push(doc.toLowerCase());
                }
              }
            });
          }
        }
        datasets.push(sample);
      }
      response.data.labels = labels;
      response.data.datasets = datasets;
      return { labels, datasets };
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal server error",
        status: 500,
      });
    }
  };
  colleges = async (req, res) => {
    try {
      const property = req?.params?.property;
      const token = req?.headers?.authorization;
      const { dates, areaId, duration_type } = req?.body;
      if (dates?.length < 2 && property !== "radialChart") {
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
        const report = await MaqamReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            maqamAreaId: areaId,
          },
          "collegesId"
        ).populate("collegesId");
        if (report?.length > 0) {
          const keys = Object.keys(
            report[report?.length - 1].collegesId._doc
          ).filter((key) => key !== "_id" && key !== "__v");
          if (property === "spiderChart" || property === "radialChart") {
            keys.forEach((doc) => {
              if (report[report?.length - 1].collegesId._doc[doc]) {
                sample.data.push(
                  this.calculatePercentage(
                    report[report?.length - 1].collegesId._doc[doc]._doc.end,
                    report[report?.length - 1].collegesId._doc[doc]._doc.monthly
                  )
                );
                if (!labels.includes(doc.toLowerCase())) {
                  labels.push(doc.toLowerCase());
                }
              }
            });
          } else {
            keys.forEach((doc) => {
              if (report[report?.length - 1].collegesId._doc[doc]) {
                sample.data.push(
                  parseInt(
                    report[report?.length - 1].collegesId._doc[doc]._doc.end
                  )
                );
                if (!labels.includes(doc.toLowerCase())) {
                  labels.push(doc.toLowerCase());
                }
              }
            });
          }
        }
        datasets.push(sample);
      }
      response.data.labels = labels;
      response.data.datasets = datasets;

      return { labels, datasets };
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal server error",
        status: 500,
      });
    }
  };
  jamiaat = async (req, res) => {
    try {
      const property = req?.params?.property;
      const token = req?.headers?.authorization;
      const { dates, areaId, duration_type } = req?.body;
      if (dates?.length < 2 && property !== "radialChart") {
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
        const report = await MaqamReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            maqamAreaId: areaId,
          },
          "jamiaatId"
        ).populate("jamiaatId");
        if (report?.length > 0) {
          const keys = Object.keys(
            report[report?.length - 1].jamiaatId._doc
          ).filter((key) => key !== "_id" && key !== "__v");
          if (property === "spiderChart" || property === "radialChart") {
            keys.forEach((doc) => {
              if (report[report?.length - 1].jamiaatId._doc[doc]) {
                sample.data.push(
                  this.calculatePercentage(
                    report[report?.length - 1].jamiaatId._doc[doc]._doc.end,
                    report[report?.length - 1].jamiaatId._doc[doc]._doc.monthly
                  )
                );
                if (!labels.includes(doc.toLowerCase())) {
                  labels.push(doc.toLowerCase());
                }
              }
            });
          } else {
            keys.forEach((doc) => {
              if (report[report?.length - 1].jamiaatId._doc[doc]) {
                sample.data.push(
                  parseInt(
                    report[report?.length - 1].jamiaatId._doc[doc]._doc.end
                  )
                );
                if (!labels.includes(doc.toLowerCase())) {
                  labels.push(doc.toLowerCase());
                }
              }
            });
          }
        }
        datasets.push(sample);
      }
      response.data.labels = labels;
      response.data.datasets = datasets;
      return { labels, datasets };
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal server error",
        status: 500,
      });
    }
  };
  createMaqamIfradiQuawatReport = async (req, res) => {
    try {
      const property = req?.params?.property;
      const token = req?.headers?.authorization;
      const { dates, areaId, duration_type } = req?.body;
      if (dates?.length < 2 && property !== "radialChart") {
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
        const report = await MaqamReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            maqamAreaId: areaId,
          },
          "wiId"
        ).populate("wiId");
        if (report?.length > 0) {
          const keys = Object.keys(report[report?.length - 1].wiId._doc).filter(
            (key) => key !== "_id" && key !== "__v"
          );
          if (property === "spiderChart" || property === "radialChart") {
            keys.forEach((doc) => {
              if (report[report?.length - 1].wiId._doc[doc]) {
                sample.data.push(
                  this.calculatePercentage(
                    parseInt(
                      report[report?.length - 1].wiId._doc[doc]._doc.start
                    ) +
                      parseInt(
                        report[report?.length - 1].wiId._doc[doc]._doc.increase
                      ) -
                      parseInt(
                        report[report?.length - 1].wiId._doc[doc]._doc.decrease
                      ),
                    report[report?.length - 1].wiId._doc[doc]._doc.monthly
                  )
                );
                if (!labels.includes(doc.toLowerCase())) {
                  labels.push(doc.toLowerCase());
                }
              }
            });
          } else {
            keys.forEach((doc) => {
              if (report[report?.length - 1].wiId._doc[doc]) {
                sample.data.push(
                  parseInt(
                    report[report?.length - 1].wiId._doc[doc]._doc.start
                  ) +
                    parseInt(
                      report[report?.length - 1].wiId._doc[doc]._doc.increase
                    ) -
                    parseInt(
                      report[report?.length - 1].wiId._doc[doc]._doc.decrease
                    )
                );
                if (!labels.includes(doc.toLowerCase())) {
                  labels.push(doc.toLowerCase());
                }
              }
            });
          }
        }
        datasets.push(sample);
      }
      response.data.labels = labels;
      response.data.datasets = datasets;
      return { labels, datasets };
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal server error",
        status: 500,
      });
    }
  };
  createActivitiesReport = async (req, res) => {
    try {
      const property = req?.params?.property;
      const token = req?.headers?.authorization;
      const { dates, areaId, duration_type } = req?.body;
      if (dates?.length < 2 && property !== "radialChart") {
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
        const reports = await MaqamReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            maqamAreaId: areaId,
          },
          "maqamActivityId"
        ).populate("maqamActivityId");
        if (reports?.length > 0) {
          const keys = Object.keys(
            reports[reports?.length - 1]._doc.maqamActivityId._doc
          ).filter((i) => i !== "_id" && i !== "__v");
          if (property === "spiderChart" || property === "radialChart") {
            keys.forEach((doc) => {
              if (reports[reports?.length - 1]._doc?.maqamActivityId._doc) {
                sample.data.push(
                  this.calculatePercentage(
                    reports[reports?.length - 1]._doc?.maqamActivityId._doc[doc]
                      .done,
                    reports[reports?.length - 1]._doc?.maqamActivityId._doc[doc]
                      .decided
                  )
                );
                if (!labels.includes(doc.toLowerCase())) {
                  labels.push(doc.toLowerCase());
                }
              }
            });
          } else {
            keys.forEach((doc) => {
              if (reports[reports?.length - 1]._doc?.maqamActivityId._doc) {
                sample.data.push(
                  parseInt(
                    reports[reports?.length - 1]._doc.maqamActivityId._doc[doc]
                      .done
                  )
                );
                if (!labels.includes(doc.toLowerCase())) {
                  labels.push(doc.toLowerCase());
                }
              }
            });
          }
        }
        datasets.push(sample);
      }
      response.data.labels = labels;
      response.data.datasets = datasets;
      return { labels, datasets };
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  createMentionedActivitesReport = async (req, res) => {
    try {
      const property = req?.params?.property;
      const token = req?.headers?.authorization;
      const { dates, areaId, duration_type } = req?.body;
      if (dates?.length < 2 && property !== "radialChart") {
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
        const reports = await MaqamReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            maqamAreaId: areaId,
          },
          "mentionedActivityId"
        ).populate("mentionedActivityId");
        if (reports?.length > 0) {
          const keys = Object.keys(
            reports[reports?.length - 1]._doc.mentionedActivityId._doc
          ).filter((i) => i !== "_id" && i !== "__v");
          if (property === "spiderChart" || property === "radialChart") {
            keys.forEach((doc) => {
              if (reports[reports?.length - 1]._doc?.mentionedActivityId._doc) {
                sample.data.push(
                  this.calculatePercentage(
                    reports[reports?.length - 1]._doc.mentionedActivityId._doc[
                      doc
                    ].sum
                      ? reports[reports?.length - 1]._doc.mentionedActivityId
                          ._doc[doc].sum
                      : reports[reports.length - 1]._doc.mentionedActivityId
                          ._doc[doc].done,
                    reports[reports?.length - 1]._doc.mentionedActivityId._doc[
                      doc
                    ].decided
                  )
                );
                if (!labels.includes(doc.toLowerCase())) {
                  labels.push(doc.toLowerCase());
                }
              }
            });
          } else {
            keys.forEach((doc) => {
              if (reports[reports?.length - 1]._doc?.mentionedActivityId._doc) {
                sample.data.push(
                  parseInt(
                    reports[reports?.length - 1]._doc.mentionedActivityId._doc[
                      doc
                    ].sum
                      ? reports[reports?.length - 1]._doc.mentionedActivityId
                          ._doc[doc].sum
                      : reports[reports.length - 1]._doc.mentionedActivityId
                          ._doc[doc].done
                  )
                );
                if (!labels.includes(doc.toLowerCase())) {
                  labels.push(doc.toLowerCase());
                }
              }
            });
          }
        }
        datasets.push(sample);
      }
      response.data.labels = labels;
      response.data.datasets = datasets;
      return { labels, datasets };
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  createOtherActivityReport = async (req, res) => {
    try {
      const token = req?.headers?.authorization;
      const { dates, areaId, duration_type } = req?.body;
      if (dates?.length < 2 && property !== "radialChart") {
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
        const reports = await MaqamReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            maqamAreaId: areaId,
          },
          "otherActivityId"
        ).populate("otherActivityId");

        if (reports?.length > 0) {
          const keys = Object.keys(
            reports[reports?.length - 1]._doc.otherActivityId._doc
          ).filter((i) => i !== "_id" && i !== "__v" && i !== "anyOther");
          keys.forEach((doc) => {
            if (reports[reports?.length - 1]._doc?.otherActivityId._doc) {
              sample.data.push(
                parseInt(
                  reports[reports?.length - 1]._doc?.otherActivityId._doc[doc]
                )
              );
              if (!labels.includes(doc.toLowerCase())) {
                labels.push(doc.toLowerCase());
              }
            }
          });
        }
        datasets.push(sample);
      }
      response.data.labels = labels;
      response.data.datasets = datasets;
      return { labels, datasets };
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  toseeDawatReport = async (req, res) => {
    try {
      const property = req?.params?.property;
      const token = req?.headers?.authorization;
      const { dates, areaId, duration_type } = req?.body;
      if (dates?.length < 2 && property !== "radialChart") {
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
        const reports = await MaqamReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            maqamAreaId: areaId,
          },
          "muntakhibTdId"
        ).populate("muntakhibTdId");
        reports?.map((obj) => {
          if (!obj?.tdId) {
            return null;
          }

          if (reports?.length > 0) {
            const keys = Object.keys(
              reports[reports.length - 1]._doc.tdId._doc
            ).filter(
              (i) =>
                i !== "_id" &&
                i !== "__v" &&
                i !== "current" &&
                i !== "currentManual" &&
                i !== "meetings" &&
                i !== "meetingsManual" &&
                i !== "registered"
            );

            if (property === "spiderChart" || property === "radialChart") {
              if (reports[reports.length - 1]._doc?.tdId._doc) {
                sample.data.push(
                  this.calculatePercentage(
                    reports[reports.length - 1]._doc?.tdId._doc["meetingsSum"],
                    reports[reports.length - 1]._doc?.tdId._doc[
                      "rwabitMeetingsGoal"
                    ]
                  )
                );

                !labels.includes("meetings") ? labels.push("meetings") : null;
              }
            } else {
              keys.forEach((doc) => {
                if (
                  reports[reports.length - 1]._doc?.tdId._doc &&
                  ![
                    "current",
                    "currentmanual",
                    "meetings",
                    "meetingsmanual",
                  ].includes(doc)
                ) {
                  sample.data.push(
                    parseInt(reports[reports.length - 1]._doc?.tdId._doc[doc])
                  );
                  if (
                    !labels.includes(doc.toLowerCase()) &&
                    ![
                      "current",
                      "currentmanual",
                      "meetings",
                      "meetingsmanual",
                    ].includes(doc.toLowerCase())
                  ) {
                    labels.push(doc.toLowerCase());
                  }
                }
              });
            }
          }
          datasets.push(sample);
        });
      }
      response.data.labels = labels;
      response.data.datasets = datasets;

      return { labels, datasets };
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  muntakhibTdId = async (req, res) => {
    try {
      const property = req?.params?.property;
      const token = req?.headers?.authorization;
      const { dates, areaId, duration_type } = req?.body;
      if (dates?.length < 2 && property !== "radialChart") {
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
        const reports = await MaqamReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            maqamAreaId: areaId,
          },
          "muntakhibTdId"
        ).populate("muntakhibTdId");
        reports?.map((obj) => {
          if (!obj?.muntakhibTdId) {
            return null;
          }
          if (reports?.length > 0) {
            const keys = Object.keys(
              reports[reports.length - 1]._doc.muntakhibTdId._doc
            ).filter((i) => i !== "_id" && i !== "__v" && i !== "registered");
            if (property === "spiderChart" || property === "radialChart") {
              if (reports[reports.length - 1]._doc?.muntakhibTdId._doc) {
                sample.data.push(
                  this.calculatePercentage(
                    reports[reports.length - 1]._doc?.muntakhibTdId._doc[
                      "meetingsSum"
                    ],
                    reports[reports.length - 1]._doc?.muntakhibTdId._doc[
                      "rwabitMeetingsGoal"
                    ]
                  )
                );

                !labels.includes("meetings") ? labels.push("meetings") : null;
              }
            } else {
              keys.forEach((doc) => {
                if (
                  reports[reports.length - 1]._doc?.muntakhibTdId._doc &&
                  ![
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
                  ].includes(doc)
                ) {
                  sample.data.push(
                    parseInt(
                      reports[reports.length - 1]._doc?.muntakhibTdId._doc[doc]
                    )
                  );
                  if (
                    !labels.includes(doc.toLowerCase()) &&
                    ![
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
                    ].includes(doc.toLowerCase())
                  ) {
                    labels.push(doc.toLowerCase());
                  }
                }
              });
            }
          }
          datasets.push(sample);
        });
      }
      response.data.labels = labels;
      response.data.datasets = datasets;
      return { labels, datasets };
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  libraryReport = async (req, res) => {
    try {
      const token = req?.headers?.authorization;
      const { dates, areaId, duration_type } = req?.body;
      if (dates?.length < 2 && property !== "radialChart") {
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
        const reports = await MaqamReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            maqamAreaId: areaId,
          },
          "maqamDivisionLibId"
        ).populate("maqamDivisionLibId");

        if (reports?.length > 0) {
          const keys = Object.keys(
            reports[reports?.length - 1]._doc.maqamDivisionLibId._doc
          ).filter((key) => key !== "_id" && key !== "__v");
          keys.forEach((doc) => {
            if (
              reports[reports?.length - 1]._doc?.maqamDivisionLibId._doc &&
              reports[reports?.length - 1]._doc?.maqamDivisionLibId._doc[doc]
            ) {
              sample.data.push(
                parseInt(
                  reports[reports?.length - 1]._doc?.maqamDivisionLibId._doc[
                    doc
                  ] || 0
                )
              );
              if (!labels.includes(doc.toLowerCase())) {
                labels.push(doc.toLowerCase());
              }
            }
          });
        }
        datasets.push(sample);
      }
      response.data.labels = labels;
      response.data.datasets = datasets;
      return { labels, datasets };
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  paighamDigest = async (req, res) => {
    try {
      const token = req?.headers?.authorization;
      const { dates, areaId, duration_type } = req?.body;
      if (dates?.length < 2 && property !== "radialChart") {
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
        const reports = await MaqamReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            maqamAreaId: areaId,
          },
          "paighamDigestId"
        ).populate("paighamDigestId");

        if (reports?.length > 0) {
          const keys = Object.keys(
            reports[reports?.length - 1]._doc.paighamDigestId._doc
          ).filter((i) => i !== "_id" && i !== "__v");
          keys.forEach((doc) => {
            if (reports[reports?.length - 1]._doc?.paighamDigestId._doc) {
              sample.data.push(
                parseInt(
                  reports[reports?.length - 1]._doc?.paighamDigestId._doc[
                    doc
                  ] || 0
                )
              );
              if (!labels.includes(doc.toLowerCase())) {
                labels.push(doc.toLowerCase());
              }
            }
          });
        }
        datasets.push(sample);
      }
      response.data.labels = labels;
      response.data.datasets = datasets;
      return { labels, datasets };
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  rozShabBedari = async (req, res) => {
    try {
      const property = req?.params?.property;
      const token = req?.headers?.authorization;
      const { dates, areaId, duration_type } = req?.body;
      if (dates?.length < 2 && property !== "radialChart") {
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
        const reports = await MaqamReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            maqamAreaId: areaId,
          },
          "rsdId"
        ).populate("rsdId");

        if (reports?.length > 0) {
          const keys = Object.keys(
            reports[reports?.length - 1]._doc.rsdId._doc
          ).filter((i) => i !== "_id" && i !== "__v");
          if (property === "spiderChart" || property === "radialChart") {
            const report = await MaqamReportModel.find(
              {
                month: {
                  $gt: sod,
                  $lte: eod,
                },
                maqamAreaId: areaId,
              },
              "wiId"
            ).populate("wiId");
            let temp = {};
            if (report?.length > 0) {
              const keys = Object.keys(
                report[report?.length - 1].wiId._doc
              ).filter((key) => key !== "_id" && key !== "__v");
              keys
                .filter(
                  (ke) =>
                    ke.toLowerCase() === "umeedwaran" ||
                    ke.toLowerCase() === "rafaqa"
                )
                .forEach((doc) => {
                  if (report[report?.length - 1].wiId._doc[doc]) {
                    temp = {
                      ...temp,
                      [doc.toLowerCase()]:
                        parseInt(
                          report[report?.length - 1].wiId._doc[doc]._doc.start
                        ) +
                        parseInt(
                          report[report?.length - 1].wiId._doc[doc]._doc
                            .increase
                        ) -
                        parseInt(
                          report[report?.length - 1].wiId._doc[doc]._doc
                            .decrease
                        ),
                    };
                  }
                });
              if (reports?.length > 0) {
                const keys = Object.keys(
                  reports[reports.length - 1]._doc.rsdId._doc
                ).filter((i) => i !== "_id" && i !== "__v");
                keys
                  .filter((ke) =>
                    ke.toLowerCase() === "umeedwaranfilledsum"
                      ? ke.toLowerCase() === "umeedwaranfilledsum"
                      : "" || ke.toLowerCase() === "rafaqafilledsum"
                      ? ke.toLowerCase() === "rafaqafilledsum"
                      : ke.toLowerCase() === "rafaqafilled"
                  )
                  .forEach((doc) => {
                    if (
                      doc === "rafaqaFilled" &&
                      keys.includes("rafaqaFilledSum")
                    ) {
                      return;
                    }
                    if (
                      reports[reports.length - 1]._doc?.rsdId._doc[doc] !== null
                    ) {
                      sample.data.push(
                        this.calculatePercentage(
                          reports[reports.length - 1]._doc?.rsdId._doc[doc],
                          temp[`${[doc.split("Filled")[0].toLowerCase()]}`]
                        )
                      );
                      if (!labels.includes(doc.toLowerCase())) {
                        [
                          "rafaqafilled",
                          "umeedwaranfilledsum",
                          "rafaqafilledsum",
                        ].includes(doc.toLowerCase())
                          ? labels.push(doc.toLowerCase())
                          : null;
                      }
                    }
                  });
              }
            }
          } else {
            keys.forEach((doc) => {
              if (
                reports[reports?.length - 1]._doc?.rsdId._doc &&
                doc.toLowerCase() !== "manualrafaqafilled" &&
                doc.toLowerCase() !== "manualumeedwaran" &&
                doc.toLowerCase() !== "umeedwaranfilled" &&
                doc.toLowerCase() !== "rafaqafilled"
              ) {
                sample.data.push(
                  parseInt(reports[reports?.length - 1]._doc?.rsdId._doc[doc])
                );
                if (
                  !labels.includes(doc.toLowerCase()) &&
                  doc.toLowerCase() !== "manualrafaqafilled" &&
                  doc.toLowerCase() !== "manualumeedwaran" &&
                  doc.toLowerCase() !== "umeedwaranfilled" &&
                  doc.toLowerCase() !== "rafaqafilled"
                ) {
                  labels.push(doc.toLowerCase());
                }
              }
            });
          }
        }
        datasets.push(sample);
      }
      response.data.labels = labels;
      response.data.datasets = datasets;
      return { labels, datasets };
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  baitulmal = async (req, res) => {
    try {
      const property = req?.params?.property;
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
            message: "Invalid duration type",
            status: 403,
          });
        }
        const reports = await MaqamReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            maqamAreaId: areaId,
          },
          "baitulmalId"
        ).populate("baitulmalId");

        if (reports?.length > 0) {
          const keys = Object.keys(
            reports[reports?.length - 1]._doc.baitulmalId._doc
          ).filter((i) => i !== "_id" && i !== "__v");
          if (property === "spiderChart" || property === "radialChart") {
            if (reports[reports?.length - 1]._doc?.baitulmalId._doc) {
              const income =
                reports[reports?.length - 1]._doc?.baitulmalId._doc[
                  "monthlyIncome"
                ];
              const expenditure =
                reports[reports?.length - 1]._doc?.baitulmalId._doc[
                  "monthlyExpenditure"
                ];

              const profitLossPercentage = this.calculateProfitLossPercentage(
                income,
                expenditure
              );

              sample.data.push(profitLossPercentage);
              !labels.includes("monthlyexpenditure")
                ? labels.push("monthlyexpenditure")
                : null;
            }
          } else {
            keys.forEach((doc) => {
              if (reports[reports?.length - 1]._doc?.baitulmalId._doc) {
                sample.data.push(
                  parseInt(
                    reports[reports?.length - 1]._doc?.baitulmalId._doc[doc]
                  )
                );
                if (!labels.includes(doc.toLowerCase())) {
                  labels.push(doc.toLowerCase());
                }
              }
            });
          }
        }
        datasets.push(sample);
      }
      response.data.labels = labels;
      response.data.datasets = datasets;
      return { labels, datasets };
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  maqamComparison = async (req, res) => {
    try {
      const token = req?.headers?.authorization;
      if (!token) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 400,
        });
      }

      const decoded = jwt.decode(token.split(" ")[1]);
      const userId = decoded?.id;
      if (!userId) {
        return this.sendResponse(req, res, {
          message: "ID is required",
          status: 403,
        });
      }

      const { dates } = req.body;
      if (dates.length < 2) {
        return this.sendResponse(req, res, {
          message: "Atleast 2 dates required",
          status: 400,
        });
      }

      const labels = [];
      const datasets = [];

      const reportFunctions = [
        this.maqamTanzeemReport,
        this.jamiaat,
        this.colleges,
        this.createMaqamIfradiQuawatReport,
        this.createActivitiesReport,
        this.createMentionedActivitesReport,
        this.createOtherActivityReport,
        this.toseeDawatReport,
        this.muntakhibTdId,
        this.libraryReport,
        this.paighamDigest,
        this.rozShabBedari,
        this.baitulmal,
      ];

      // Utility function to find a dataset with a specific label
      const findDatasetByLabel = (label) =>
        datasets.find((dataset) => dataset.label === label);

      for (const reportFunction of reportFunctions) {
        const { labels: reportLabels, datasets: reportDatasets } =
          await reportFunction.call(this, req);

        // Update labels
        reportLabels.forEach((label) => {
          if (!labels.includes(label) && labels !== "studycircle") {
            labels.push(label);
          } else {
            labels.push(label);
          }
        });

        // Update datasets
        reportDatasets.forEach((reportDataset) => {
          const existingDataset = findDatasetByLabel(reportDataset.label);
          if (existingDataset) {
            // If dataset with the same label exists, merge its data
            existingDataset.data.push(...reportDataset.data);
          } else {
            // Otherwise, add the new dataset
            datasets.push(reportDataset);
          }
        });
      }

      // Update response
      response.data.labels = labels;
      response.data.datasets = datasets;
      response.data.chart = 'compareAll';

      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  divisionComparison = async (req, res) => {
    try {
      const token = req?.headers?.authorization;
      if (!token) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 400,
        });
      }

      const decoded = jwt.decode(token.split(" ")[1]);
      const userId = decoded?.id;
      if (!userId) {
        return this.sendResponse(req, res, {
          message: "ID is required",
          status: 403,
        });
      }

      const { dates } = req.body;
      if (dates.length < 2) {
        return this.sendResponse(req, res, {
          message: "Atleast 2 dates required",
          status: 400,
        });
      }

      const labels = [];
      const datasets = [];

      const reportFunctions = [
        this.divisionTanzeemReport,
        this.jamiaat,
        this.colleges,
        this.createDivisionfradiQuawatReport,
        this.createActivitiesReport,
        this.createMentionedActivitesReport,
        this.createOtherActivityReport,
        this.toseeDawatReport,
        this.libraryReport,
        this.paighamDigest,
        this.rozShabBedari,
        this.baitulmal,
      ];

      // Utility function to find a dataset with a specific label
      const findDatasetByLabel = (label) =>
        datasets.find((dataset) => dataset.label === label);

      for (const reportFunction of reportFunctions) {
        const { labels: reportLabels, datasets: reportDatasets } =
          await reportFunction.call(this, req);

        // Update labels
        reportLabels.forEach((label) => {
          if (!labels.includes(label) && labels !== "studycircle") {
            labels.push(label);
          } else {
            labels.push(label);
          }
        });

        // Update datasets
        reportDatasets.forEach((reportDataset) => {
          const existingDataset = findDatasetByLabel(reportDataset.label);
          if (existingDataset) {
            // If dataset with the same label exists, merge its data
            existingDataset.data.push(...reportDataset.data);
          } else {
            // Otherwise, add the new dataset
            datasets.push(reportDataset);
          }
        });
      }

      // Update response
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
  spiderChart = async (req, res) => {
    try {
      const token = req?.headers?.authorization;
      if (!token) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 400,
        });
      }

      const decoded = jwt.decode(token.split(" ")[1]);
      const userId = decoded?.id;
      if (!userId) {
        return this.sendResponse(req, res, {
          message: "ID is required",
          status: 403,
        });
      }

      const { dates } = req.body;

      if (dates.length < 2) {
        return this.sendResponse(req, res, {
          message: "Atleast 2 dates required",
          status: 400,
        });
      }

      const labels = [];
      const datasets = [];

      const reportFunctions = [
        this.maqamTanzeemReport,
        this.jamiaat,
        this.colleges,
        this.createMaqamIfradiQuawatReport,
        this.createActivitiesReport,
        this.createMentionedActivitesReport,
        this.toseeDawatReport,
        this.muntakhibTdId,
        this.rozShabBedari,
        this.baitulmal,
      ];

      // Utility function to find a dataset with a specific label
      const findDatasetByLabel = (label) =>
        datasets.find((dataset) => dataset.label === label);

      for (const reportFunction of reportFunctions) {
        const { labels: reportLabels, datasets: reportDatasets } =
          await reportFunction.call(this, req);

        // Update labels
        reportLabels.forEach((label) => {
          if (!labels.includes(label) && labels !== "studycircle") {
            labels.push(label);
          } else {
            labels.push(label);
          }
        });

        // Update datasets
        reportDatasets.forEach((reportDataset) => {
          const existingDataset = findDatasetByLabel(reportDataset.label);
          if (existingDataset) {
            // If dataset with the same label exists, merge its data
            existingDataset.data.push(...reportDataset.data);
          } else {
            // Otherwise, add the new dataset
            datasets.push(reportDataset);
          }
        });
      }

      // Update response
      response.data.labels = labels;
      response.data.datasets = datasets;
      response.data.chart = 'spider';
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  radialChart = async (req, res) => {
    try {
      const token = req?.headers?.authorization;
      if (!token) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 400,
        });
      }

      const decoded = jwt.decode(token.split(" ")[1]);
      const userId = decoded?.id;
      if (!userId) {
        return this.sendResponse(req, res, {
          message: "ID is required",
          status: 403,
        });
      }

      const { dates } = req.body;

      if (dates.length > 1) {
        return this.sendResponse(req, res, {
          message: "Atleast 2 dates required",
          status: 400,
        });
      }

      const labels = [];
      let datasets = [];

      const reportFunctions = [
        this.maqamTanzeemReport,
        this.jamiaat,
        this.colleges,
        this.createMaqamIfradiQuawatReport,
        this.createActivitiesReport,
        this.createMentionedActivitesReport,
        this.toseeDawatReport,
        this.muntakhibTdId,
        this.rozShabBedari,
        // this.baitulmal,
      ];

      // Utility function to find a dataset with a specific label
      const findDatasetByLabel = (label) =>
        datasets.find((dataset) => dataset.label === label);

      for (const reportFunction of reportFunctions) {
        const { labels: reportLabels, datasets: reportDatasets } =
          await reportFunction.call(this, req);

        // Update labels
        reportLabels.forEach((label) => {
          if (!labels.includes(label) && labels !== "studycircle") {
            labels.push(label);
          } else {
            labels.push(label);
          }
        });

        // Update datasets
        reportDatasets.forEach((reportDataset) => {
          const existingDataset = findDatasetByLabel(reportDataset.label);
          if (existingDataset) {
            // If dataset with the same label exists, merge its data
            existingDataset.data.push(...reportDataset.data);
          } else {
            // Otherwise, add the new dataset
            datasets.push(reportDataset);
          }
        });
      }
      let colors = [];
      labels.forEach((i) => colors.push(this.getRandomRGB()));
      // Update response
      datasets = datasets[0]?.data.map((item) => parseFloat(item));
      let combinedArray = datasets.map((dataset, index) => {
        return { dataset, label: labels[index] };
      });
      combinedArray.sort((a, b) => a.dataset - b.dataset);
      let sortedDatasets = combinedArray.map((item) => item.dataset);
      let sortedLabels = combinedArray.map((item) => item.label);
      response.data.labels = sortedLabels;
      response.data.datasets = sortedDatasets;
      response.data.colors = colors;
      response.data.chart = "radial";
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
      case "tanzeem":
        this.maqamTanzeemReport(req, res);
        break;
      case "workerInfo":
        this.createMaqamIfradiQuawatReport(req, res);
        break;
      case "activities":
        this.createActivitiesReport(req, res);
        break;
      case "mentionedActivities":
        this.createMentionedActivitesReport(req, res);
        break;
      case "otherActivity":
        this.createOtherActivityReport(req, res);
        break;
      case "toseeDawat":
        this.toseeDawatReport(req, res);
        break;
      case "library":
        this.libraryReport(req, res);
        break;
      case "paighamDigest":
        this.paighamDigest(req, res);
        break;
      case "rozShabBedari":
        this.rozShabBedari(req, res);
        break;
      case "compareAll":
        this.maqamComparison(req, res);
        break;
      case "spiderChart":
        this.spiderChart(req, res);
        break;
      case "radialChart":
        this.radialChart(req, res);
        break;
      default:
        return this.sendResponse(req, res, {
          message: "Select a valid property",
          status: 400,
        });
    }
  };
}

module.exports = { MaqamCompare };
