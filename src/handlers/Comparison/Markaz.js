const { UserModel } = require("../../model");
const {
  Mark,
  MarkazReportModelazReportModel,
  MarkazReportModel,
} = require("../../model/reports");
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
class MarkazCompare extends Response {
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
  colleges = async (req, res) => {
    const property = req?.params?.property;
    try {
      const token = req?.headers?.authorization;
      const { dates, areaId, duration_type } = req?.body;
      if (dates?.length < 2) {
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
        const report = await MarkazReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            countryAreaId: areaId,
          },
          "collegesId"
        ).populate("collegesId");
        if (report?.length > 0) {
          const keys = Object.keys(
            report[report?.length - 1].collegesId._doc
          ).filter((key) => key !== "_id" && key !== "__v");
          if (property === "spiderChart") {
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
    const property = req?.params?.property;
    try {
      const token = req?.headers?.authorization;
      const { dates, areaId, duration_type } = req?.body;
      if (dates?.length < 2) {
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
        const report = await MarkazReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            countryAreaId: areaId,
          },
          "jamiaatId"
        ).populate("jamiaatId");
        if (report?.length > 0) {
          const keys = Object.keys(
            report[report?.length - 1].jamiaatId._doc
          ).filter((key) => key !== "_id" && key !== "__v");
          if (property === "spiderChart") {
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
  markazTanzeemReport = async (req, res) => {
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
        const report = await MarkazReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            countryAreaId: areaId,
          },
          "markazTanzeemId"
        ).populate("markazTanzeemId");

        if (report?.length > 0) {
          const keys = Object.keys(
            report[report?.length - 1].markazTanzeemId._doc
          ).filter((key) => key !== "_id" && key !== "__v");
          if (property === "spiderChart") {
            keys.forEach((doc) => {
              if (report[report?.length - 1].markazTanzeemId._doc[doc]) {
                sample.data.push(
                  this.calculatePercentage(
                    parseInt(
                      report[report?.length - 1].markazTanzeemId._doc[doc]._doc
                        .start
                    ) +
                      parseInt(
                        report[report?.length - 1].markazTanzeemId._doc[doc]
                          ._doc.increase
                      ) -
                      parseInt(
                        report[report?.length - 1].markazTanzeemId._doc[doc]
                          ._doc.decrease
                      ),
                    report[report?.length - 1].markazTanzeemId._doc[doc]._doc
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
              if (report[report?.length - 1].markazTanzeemId._doc[doc]) {
                sample.data.push(
                  parseInt(
                    report[report?.length - 1].markazTanzeemId._doc[doc]._doc
                      .start
                  ) +
                    parseInt(
                      report[report?.length - 1].markazTanzeemId._doc[doc]._doc
                        .increase
                    ) -
                    parseInt(
                      report[report?.length - 1].markazTanzeemId._doc[doc]._doc
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
  createMarkazfradiQuawatReport = async (req, res) => {
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
        const report = await MarkazReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            countryAreaId: areaId,
          },
          "markazWorkerInfoId"
        ).populate("markazWorkerInfoId");
        if (report?.length > 0) {
          const keys = Object.keys(
            report[report?.length - 1].markazWorkerInfoId._doc
          ).filter((key) => key !== "_id" && key !== "__v");
          if (property === "spiderChart") {
            keys.forEach((doc) => {
              if (report[report?.length - 1].markazWorkerInfoId._doc[doc]) {
                sample.data.push(
                  this.calculatePercentage(
                    parseInt(
                      report[report?.length - 1].markazWorkerInfoId._doc[doc]
                        ._doc.startSum
                    ) +
                      parseInt(
                        report[report?.length - 1].markazWorkerInfoId._doc[doc]
                          ._doc.increaseSum
                      ) -
                      parseInt(
                        report[report?.length - 1].markazWorkerInfoId._doc[doc]
                          ._doc.decreaseSum
                      ),
                    report[report?.length - 1].markazWorkerInfoId._doc[doc]._doc
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
              if (report[report?.length - 1].markazWorkerInfoId._doc[doc]) {
                sample.data.push(
                  parseInt(
                    report[report?.length - 1].markazWorkerInfoId._doc[doc]._doc
                      .startSum
                  ) +
                    parseInt(
                      report[report?.length - 1].markazWorkerInfoId._doc[doc]
                        ._doc.increaseSum
                    ) -
                    parseInt(
                      report[report?.length - 1].markazWorkerInfoId._doc[doc]
                        ._doc.decreaseSum
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
        const reports = await MarkazReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            countryAreaId: areaId,
          },
          "markazActivityId"
        ).populate("markazActivityId");
        if (reports.length > 0) {
          const keys = Object.keys(
            reports[reports.length - 1]._doc.markazActivityId._doc
          ).filter((i) => i !== "_id" && i !== "__v");
          if (property === "spiderChart") {
            keys.forEach((doc) => {
              if (reports[reports?.length - 1].markazActivityId._doc[doc]) {
                sample.data.push(
                  this.calculatePercentage(
                    reports[reports?.length - 1].markazActivityId._doc[doc]._doc
                      .done,
                    reports[reports?.length - 1].markazActivityId._doc[doc]._doc
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
              if (reports[reports.length - 1]._doc?.markazActivityId._doc) {
                sample.data.push(
                  parseInt(
                    reports[reports.length - 1]._doc.markazActivityId._doc[doc]
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
        const reports = await MarkazReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            countryAreaId: areaId,
          },
          "mentionedActivityId"
        ).populate("mentionedActivityId");
        if (reports.length > 0) {
          const keys = Object.keys(
            reports[reports.length - 1]._doc.mentionedActivityId._doc
          ).filter((i) => i !== "_id" && i !== "__v");
          if (property === "spiderChart") {
            keys.forEach((doc) => {
              if (reports[reports?.length - 1].mentionedActivityId._doc[doc]) {
                sample.data.push(
                  this.calculatePercentage(
                    reports[reports?.length - 1].mentionedActivityId._doc[doc]
                      ._doc.done,
                    reports[reports?.length - 1].mentionedActivityId._doc[doc]
                      ._doc.decided
                  )
                );
                if (!labels.includes(doc.toLowerCase())) {
                  labels.push(doc.toLowerCase());
                }
              }
            });
          } else {
            keys.forEach((doc) => {
              if (reports[reports.length - 1]._doc?.mentionedActivityId._doc) {
                sample.data.push(
                  parseInt(
                    reports[reports.length - 1]._doc.mentionedActivityId._doc[
                      doc
                    ].done
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
            message: "Dates are invalid",
            status: 403,
          });
        }
        const reports = await MarkazReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            countryAreaId: areaId,
          },
          "otherActivityId"
        ).populate("otherActivityId");

        if (reports?.length > 0) {
          const keys = Object.keys(
            reports[reports.length - 1]._doc.otherActivityId._doc
          ).filter((i) => i !== "_id" && i !== "__v" && i !== "anyOther");
          if (property === "spiderChart") {
            if (reports[reports?.length - 1].otherActivityId._doc) {
              sample.data.push(
                this.calculatePercentage(
                  reports[reports?.length - 1].otherActivityId._doc[
                    "tarbiyatGaah"
                  ],
                  reports[reports?.length - 1].otherActivityId._doc[
                    "tarbiyatGaahGoalSum"
                  ]
                )
              );

              labels.push("tarbiyatgaah");
            }
          } else {
            keys
              .filter(
                (ke) =>
                  ![
                    "tarbiyatgaahheldmanual",
                    "tarbiyatgaahheld",
                    "tarbiyatgaahgoalmanual",
                    "tarbiyatgaahgoal",
                  ].includes(ke.toLowerCase())
              )
              .forEach((doc) => {
                if (reports[reports.length - 1]._doc?.otherActivityId._doc) {
                  sample.data.push(
                    parseInt(
                      reports[reports.length - 1]._doc?.otherActivityId._doc[
                        doc
                      ]
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
  toseeDawatReport = async (req, res) => {
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
            message: "Dates are invalid",
            status: 403,
          });
        }
        const reports = await MarkazReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            countryAreaId: areaId,
          },
          "tdId"
        ).populate("tdId");

        if (reports?.length > 0) {
          if (reports[0]?.tdId === null) {
            return this.sendResponse(req, res, {
              message: "Selected property contains no values",
              status: 400,
            });
          }
          const keys = Object.keys(
            reports[reports.length - 1]._doc.tdId._doc
          ).filter((i) => i !== "_id" && i !== "__v");
          if (property === "spiderChart") {
            if (reports[reports.length - 1]._doc?.tdId._doc) {
              sample.data.push(
                this.calculatePercentage(
                  reports[reports?.length - 1]._doc?.tdId._doc["meetings"],
                  reports[reports?.length - 1]._doc?.tdId._doc[
                    "rwabitMeetingsGoal"
                  ]
                )
              );

              labels.push("meetings");
            }
          } else {
            keys.forEach((doc) => {
              if (
                reports[reports.length - 1]._doc?.tdId._doc &&
                reports[reports.length - 1]._doc?.tdId._doc[doc] !== false
              ) {
                sample.data.push(
                  parseInt(reports[reports.length - 1]._doc?.tdId._doc[doc])
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
  libraryReport = async (req, res) => {
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
        const reports = await MarkazReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            countryAreaId: areaId,
          },
          "markazDivisionLibId"
        ).populate("markazDivisionLibId");

        if (reports?.length > 0) {
          const keys = Object.keys(
            reports[reports.length - 1]._doc.markazDivisionLibId._doc
          ).filter((i) => i !== "_id" && i !== "__v");
          keys.forEach((doc) => {
            if (reports[reports.length - 1]._doc?.markazDivisionLibId._doc) {
              sample.data.push(
                parseInt(
                  reports[reports.length - 1]._doc?.markazDivisionLibId._doc[
                    doc
                  ]
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
        const reports = await MarkazReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            countryAreaId: areaId,
          },
          "rsdId"
        ).populate("rsdId");
        if (property === "spiderChart") {
          const report = await MarkazReportModel.find(
            {
              month: {
                $gt: sod,
                $lte: eod,
              },
              countryAreaId: areaId,
            },
            "markazWorkerInfoId"
          ).populate("markazWorkerInfoId");
          let temp = {};
          if (report?.length > 0) {
            const keys = Object.keys(
              report[report?.length - 1].markazWorkerInfoId._doc
            ).filter((key) => key !== "_id" && key !== "__v");
            keys
              .filter((ke) => ke === "umeedWaran" || ke === "rafaqa")
              .forEach((doc) => {
                if (report[report?.length - 1].markazWorkerInfoId._doc[doc]) {
                  temp = {
                    ...temp,
                    [doc.toLowerCase()]:
                      parseInt(
                        report[report?.length - 1].markazWorkerInfoId._doc[doc]
                          ._doc.startSum
                      ) +
                      parseInt(
                        report[report?.length - 1].markazWorkerInfoId._doc[doc]
                          ._doc.increaseSum
                      ) -
                      parseInt(
                        report[report?.length - 1].markazWorkerInfoId._doc[doc]
                          ._doc.decreaseSum
                      ),
                  };
                }
              });
            if (reports?.length > 0) {
              const keys = Object.keys(
                reports[reports.length - 1]._doc.rsdId._doc
              ).filter((i) => i !== "_id" && i !== "__v");
              keys.forEach((doc) => {
                if (reports[reports.length - 1]._doc?.rsdId._doc) {
                  sample.data.push(
                    this.calculatePercentage(
                      reports[reports.length - 1]._doc?.rsdId._doc[doc],
                      temp[`${[doc.split("Filled")[0].toLowerCase()]}`]
                    )
                  );
                  if (!labels.includes(doc.toLowerCase())) {
                    labels.push(doc.toLowerCase());
                  }
                }
              });
            }
          }
        } else {
          if (reports?.length > 0) {
            const keys = Object.keys(
              reports[reports.length - 1]._doc.rsdId._doc
            ).filter((i) => i !== "_id" && i !== "__v");
            keys.forEach((doc) => {
              if (reports[reports.length - 1]._doc?.rsdId._doc) {
                sample.data.push(
                  parseInt(reports[reports.length - 1]._doc?.rsdId._doc[doc])
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
        const reports = await MarkazReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            countryAreaId: areaId,
          },
          "baitulmalId"
        ).populate("baitulmalId");

        if (reports?.length > 0) {
          const keys = Object.keys(
            reports[reports?.length - 1]?._doc.baitulmalId?._doc
          )?.filter((i) => i !== "_id" && i !== "__v");
          if (property === "spiderChart") {
            if (reports[reports?.length - 1]?._doc?.baitulmalId?._doc) {
              const income =
                reports[reports?.length - 1]._doc.baitulmalId._doc[
                  "monthlyIncome"
                ];
              const expenditure =
                reports[reports?.length - 1]._doc.baitulmalId._doc[
                  "monthlyExpenditure"
                ];

              const profitLossPercentage = this.calculateProfitLossPercentage(
                income,
                expenditure
              );

              sample.data.push(profitLossPercentage);
              labels.push("monthlyexpenditure");
            }
          } else {
            keys?.forEach((doc) => {
              if (reports[reports?.length - 1]?._doc?.baitulmalId?._doc) {
                sample.data.push(
                  parseInt(
                    reports[reports?.length - 1]?._doc?.baitulmalId?._doc[doc]
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
  markazComparison = async (req, res) => {
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
        this.markazTanzeemReport,
        this.jamiaat,
        this.colleges,
        this.createMarkazfradiQuawatReport,
        this.createActivitiesReport,
        this.createMentionedActivitesReport,
        this.createOtherActivityReport,
        this.toseeDawatReport,
        this.libraryReport,
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
        this.markazTanzeemReport,
        this.jamiaat,
        this.colleges,
        this.createMarkazfradiQuawatReport,
        this.createActivitiesReport,
        this.createMentionedActivitesReport,
        this.createOtherActivityReport,
        this.toseeDawatReport,
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
  main = (req, res) => {
    const property = req?.params?.property;
    switch (property) {
      case "tanzeem":
        this.divisionTanzeemReport(req, res);
        break;
      case "workerInfo":
        this.createDivisionfradiQuawatReport(req, res);
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
        this.markazComparison(req, res);
        break;
      case "spiderChart":
        this.spiderChart(req, res);
        break;
      default:
        return this.sendResponse(req, res, {
          message: "Select a valid property",
          status: 400,
        });
    }
  };
}

module.exports = { MarkazCompare };
