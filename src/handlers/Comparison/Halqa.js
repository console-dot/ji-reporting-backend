const { UserModel } = require("../../model");
const { HalqaReportModel } = require("../../model/reports");
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
class HalqaCompare extends Response {
  getRandomRGB = () => {
    const r = Math.floor(Math.random() * 256); // Random red value between 0 and 255
    const g = Math.floor(Math.random() * 256); // Random green value between 0 and 255
    const b = Math.floor(Math.random() * 256); // Random blue value between 0 and 255

    return `rgb(${r}, ${g}, ${b})`;
  };
  createIfradiQuawatReport = async (req, res) => {
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
            message: "Invalid duration type",
            status: 403,
          });
        }
        const report = await HalqaReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            halqaAreaId: areaId,
          },
          "wiId"
        ).populate("wiId");
        if (report.length > 0) {
          const keys = Object.keys(report[report.length - 1].wiId._doc).filter(
            (key) => key !== "_id" && key !== "__v"
          );
          keys.forEach((doc) => {
            if (report[report.length - 1].wiId._doc[doc]) {
              sample.data.push(
                parseInt(report[report.length - 1].wiId._doc[doc]._doc.start) +
                  parseInt(
                    report[report.length - 1].wiId._doc[doc]._doc.increase
                  ) -
                  parseInt(
                    report[report.length - 1].wiId._doc[doc]._doc.decrease
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
        message: "Internal server error",
        status: 500,
      });
    }
  };
  createActivitiesReport = async (req, res) => {
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
            message: "Invalid duration type",
            status: 403,
          });
        }
        const reports = await HalqaReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            halqaAreaId: areaId,
          },
          "halqaActivityId"
        ).populate("halqaActivityId");
        if (reports?.length > 0) {
          const keys = Object.keys(
            reports[reports?.length - 1]._doc.halqaActivityId._doc
          ).filter((key) => key !== "_id" && key !== "__v");

          keys.forEach((doc) => {
            if (reports[reports?.length - 1]._doc?.halqaActivityId._doc[doc]) {
              sample.data.push(
                parseInt(
                  reports[reports?.length - 1]._doc.halqaActivityId._doc[doc]
                    ._doc.completed
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
  otherActivityReport = async (req, res) => {
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
            message: "Invalid duration type",
            status: 403,
          });
        }
        const reports = await HalqaReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            halqaAreaId: areaId,
          },
          "otherActivityId"
        ).populate("otherActivityId");

        if (reports?.length > 0) {
          const keys = Object.keys(
            reports[reports?.length - 1]._doc.otherActivityId._doc
          ).filter(
            (key) => key !== "_id" && key !== "__v" && key !== "anyOther"
          );
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
        const reports = await HalqaReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            halqaAreaId: areaId,
          },
          "tdId"
        ).populate("tdId");

        if (reports?.length > 0) {
          const keys = Object.keys(
            reports[reports?.length - 1]._doc.tdId._doc
          ).filter((key) => key !== "_id" && key !== "__v");
          keys.forEach((doc) => {
            if (reports[reports?.length - 1]._doc?.tdId._doc) {
              sample.data.push(
                parseInt(reports[reports?.length - 1]._doc?.tdId._doc[doc])
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
            message: "Invalid duration type",
            status: 403,
          });
        }
        const reports = await HalqaReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            halqaAreaId: areaId,
          },
          "halqaLibId"
        ).populate("halqaLibId");

        if (reports?.length > 0) {
          const keys = Object.keys(
            reports[reports?.length - 1]._doc.halqaLibId._doc
          ).filter((key) => key !== "_id" && key !== "__v");
          keys.forEach((doc) => {
            if (reports[reports?.length - 1]._doc?.halqaLibId._doc) {
              sample.data.push(
                parseInt(
                  reports[reports?.length - 1]._doc?.halqaLibId._doc[doc]
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
        const reports = await HalqaReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            halqaAreaId: areaId,
          },
          "rsdId"
        ).populate("rsdId");

        if (reports?.length > 0) {
          const keys = Object.keys(
            reports[reports?.length - 1]._doc.rsdId._doc
          ).filter((i) => i !== "_id" && i !== "__v");
          keys.forEach((doc) => {
            if (reports[reports?.length - 1]._doc?.rsdId._doc) {
              sample.data.push(
                parseInt(reports[reports?.length - 1]._doc?.rsdId._doc[doc])
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
  baitulmal = async (req, res) => {
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
            message: "Invalid duration type",
            status: 403,
          });
        }
        const reports = await HalqaReportModel.find(
          {
            month: {
              $gt: sod,
              $lte: eod,
            },
            halqaAreaId: areaId,
          },
          "baitulmalId"
        ).populate("baitulmalId");

        if (reports?.length > 0) {
          const keys = Object.keys(
            reports[reports?.length - 1]._doc.baitulmalId._doc
          ).filter((i) => i !== "_id" && i !== "__v");
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
  halqaComparison = async (req, res) => {
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
        this.createIfradiQuawatReport,
        this.createActivitiesReport,
        this.otherActivityReport,
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
          if (!labels.includes(label)) {
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
      case "workerInfo":
        this.createIfradiQuawatReport(req, res);
        break;
      case "activities":
        this.createActivitiesReport(req, res);
        break;
      case "otherActivity":
        this.otherActivityReport(req, res);
        break;
      case "toseeDawat":
        this.toseeDawatReport(req, res);
        break;
      case "library":
        this.libraryReport(req, res);
        break;
      case "rozShabBedari":
        this.rozShabBedari(req, res);
        break;
      case "compareAll":
        this.halqaComparison(req, res);
        break;
      default:
        return this.sendResponse(req, res, {
          message: "Select a valid property",
          status: 400,
        });
    }
  };
}

module.exports = { HalqaCompare };
