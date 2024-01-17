const {
  HalqaReportModel,
  MaqamReportModel,
  DivisionReportModel,
} = require("../model/reports");
const Response = require("./Response");

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

class Compare extends Response {
  getRandomRGB = () => {
    const r = Math.floor(Math.random() * 256); // Random red value between 0 and 255
    const g = Math.floor(Math.random() * 256); // Random green value between 0 and 255
    const b = Math.floor(Math.random() * 256); // Random blue value between 0 and 255

    return `${r}, ${g}, ${b}`;
  };
  createHalqaReport = async (req, res, sampleData) => {
    const { property } = req.params;
    const { duration, duration_type, areaId } = req.body;
    const fields = {
      activity: "halqaActivityId",
      "other-activity": "otherActivityId",
      library: "halqaLibId",
      "ifradi-kuwat": "wiId",
    };
    const db_data = {};
    switch (duration_type) {
      case "year":
        for (let i = 0; i < duration.length; i++) {
          const temp = await HalqaReportModel.find(
            {
              month: {
                $gte: new Date(duration[i] - 1, 12),
                $lte: new Date(duration[i], 12),
              },
              halqaAreaId: areaId,
            },
            fields[property]
          ).populate(fields[property]);
          db_data[duration[i]] = temp;
        }
        break;
      case "month":
        for (let i = 0; i < duration.length; i++) {
          const temp = await HalqaReportModel.find(
            {
              month: {
                $gte: new Date(duration[i].year, duration[i].month - 1),
                $lte: new Date(duration[i].year, duration[i].month),
              },
              halqaAreaId: areaId,
            },
            fields[property]
          ).populate(fields[property]);
          db_data[
            `${months[parseInt(duration[i].month)]}, ${duration[i].year}`
          ] = temp;
        }
        break;
    }
    // CALCULATION
    const finalData = {};
    Object.keys(db_data).map((key) => {
      const data_arr = db_data[key];
      let t_data = {};
      data_arr.forEach((val) => {
        const accessor = val?.[fields[property]]?._doc;
        delete accessor._id;
        delete accessor.__v;
        Object.keys(accessor).forEach((access_key) => {
          if (t_data?.[access_key]) {
            if (typeof accessor?.[access_key] === "object") {
              Object.keys(accessor?.[access_key]?._doc).forEach((i) => {
                t_data[access_key][i] += accessor?.[access_key]?.[i];
              });
            } else {
              t_data[access_key] += accessor?.[access_key];
            }
          } else {
            t_data[access_key] = accessor[access_key];
          }
        });
      });
      finalData[key] = t_data;
    });
    const result = {};
    const sd = sampleData;
    switch (property) {
      case "ifradi-kuwat":
        Object.keys(finalData).forEach((year) => {
          result[year] = {};
          Object.keys(finalData[year]).forEach((key) => {
            result[year][key] =
              finalData[year][key]?.start +
              finalData[year][key]?.increase -
              finalData[year][key]?.decrease;
          });
        });
        sampleData.labels = Object.keys(result[Object.keys(result)[0]]).map(
          (i) => i.toUpperCase()
        );
        sampleData.labels.pop();
        sampleData.datasets = [];
        Object.keys(result).forEach((key) => {
          const rgb = this.getRandomRGB();
          const ds = {
            label: key,
            data: Object.values(result[key]),
            backgroundColor: `rgba(${rgb}, 0.5)`,
            borderColor: `rgba(${rgb}, 1)`,
            borderWidth: 1,
          };
          ds.data.pop();
          sampleData.datasets.push(ds);
        });
        return this.sendResponse(req, res, {
          data: sd,
          status: 200,
        });
      case "activity":
        Object.keys(finalData).forEach((year) => {
          result[year] = {};
          Object.keys(finalData[year]).forEach((key) => {
            result[year][key] = finalData[year][key]?.completed;
          });
        });
        sampleData.labels = Object.keys(result[Object.keys(result)[0]]).map(
          (i) => i.toUpperCase()
        );
        sampleData.labels.pop();
        sampleData.datasets = [];
        Object.keys(result).forEach((key) => {
          const rgb = this.getRandomRGB();
          const ds = {
            label: key,
            data: Object.values(result[key]),
            backgroundColor: `rgba(${rgb}, 0.5)`,
            borderColor: `rgba(${rgb}, 1)`,
            borderWidth: 1,
          };
          ds.data.pop();
          sampleData.datasets.push(ds);
        });
        return this.sendResponse(req, res, {
          data: sd,
          status: 200,
        });
      case "library":
        Object.keys(finalData).forEach((year) => {
          result[year] = {};
          Object.keys(finalData[year]).forEach((key) => {
            result[year][key] = finalData[year][key];
          });
        });
        sampleData.labels = Object.keys(result[Object.keys(result)[0]]).map(
          (i) => i.toUpperCase()
        );
        sampleData.labels.pop();
        sampleData.datasets = [];
        Object.keys(result).forEach((key) => {
          const rgb = this.getRandomRGB();
          const ds = {
            label: key,
            data: Object.values(result[key]),
            backgroundColor: `rgba(${rgb}, 0.5)`,
            borderColor: `rgba(${rgb}, 1)`,
            borderWidth: 1,
          };
          ds.data.pop();
          sampleData.datasets.push(ds);
        });
        return this.sendResponse(req, res, {
          data: sd,
          status: 200,
        });
      case "other-activity":
        Object.keys(finalData).forEach((year) => {
          result[year] = {};
          Object.keys(finalData[year]).forEach((key) => {
            result[year][key] = finalData[year][key];
          });
        });
        sampleData.labels = Object.keys(result[Object.keys(result)[0]]).map(
          (i) => i.toUpperCase()
        );
        sampleData.labels.pop();
        sampleData.datasets = [];
        Object.keys(result).forEach((key) => {
          const rgb = this.getRandomRGB();
          const ds = {
            label: duration_type === "year" ? key : key.month,
            data: Object.values(result[key]),
            backgroundColor: `rgba(${rgb}, 0.5)`,
            borderColor: `rgba(${rgb}, 1)`,
            borderWidth: 1,
          };
          ds.data.pop();
          sampleData.datasets.push(ds);
        });
        return this.sendResponse(req, res, {
          data: sd,
          status: 200,
        });
    }
    return this.sendResponse(req, res, {
      message: "ok",
      status: 200,
    });
  };
  createMaqamReport = async (req, res, sampleData) => {
    const { property } = req.params;
    const { duration, duration_type, areaId } = req.body;
    const fields = {
      activity: "maqamActivityId",
      "other-activity": "otherActivityId",
      library: "maqamDivisionLibId",
      "ifradi-kuwat": "wiId",
      tanzeem: "maqamTanzeemId",
    };
    const db_data = {};
    switch (duration_type) {
      case "year":
        for (let i = 0; i < duration.length; i++) {
          const temp = await MaqamReportModel.find(
            {
              month: {
                $gte: new Date(duration[i] - 1, 12),
                $lte: new Date(duration[i], 12),
              },
              maqamAreaId: areaId,
            },
            fields[property]
          ).populate(fields[property]);
          db_data[duration[i]] = temp;
        }
        break;
      case "month":
        for (let i = 0; i < duration.length; i++) {
          const temp = await MaqamReportModel.find(
            {
              month: {
                $gte: new Date(duration[i].year, duration[i].month - 1),
                $lte: new Date(duration[i].year, duration[i].month),
              },
              maqamAreaId: areaId,
            },
            fields[property]
          ).populate(fields[property]);
          db_data[
            `${months[parseInt(duration[i].month)]}, ${duration[i].year}`
          ] = temp;
        }
        break;
    }
    // CALCULATION
    const finalData = {};
    Object.keys(db_data).map((key) => {
      const data_arr = db_data[key];
      let t_data = {};
      data_arr.forEach((val) => {
        const accessor = val?.[fields[property]]?._doc;
        delete accessor._id;
        delete accessor.__v;
        Object.keys(accessor).forEach((access_key) => {
          if (t_data?.[access_key]) {
            if (typeof accessor?.[access_key] === "object") {
              Object.keys(accessor?.[access_key]?._doc).forEach((i) => {
                t_data[access_key][i] += accessor?.[access_key]?.[i];
              });
            } else {
              t_data[access_key] += accessor?.[access_key];
            }
          } else {
            t_data[access_key] = accessor[access_key];
          }
        });
      });
      finalData[key] = t_data;
    });
    const result = {};
    const sd = sampleData;
    switch (property) {
      case "ifradi-kuwat":
        Object.keys(finalData).forEach((year) => {
          result[year] = {};
          Object.keys(finalData[year]).forEach((key) => {
            result[year][key] =
              finalData[year][key]?.start +
              finalData[year][key]?.increase -
              finalData[year][key]?.decrease;
          });
        });
        sampleData.labels = Object.keys(result[Object.keys(result)[0]]).map(
          (i) => i.toUpperCase()
        );
        sampleData.labels.pop();
        sampleData.datasets = [];
        Object.keys(result).forEach((key) => {
          const rgb = this.getRandomRGB();
          const ds = {
            label: key,
            data: Object.values(result[key]),
            backgroundColor: `rgba(${rgb}, 0.5)`,
            borderColor: `rgba(${rgb}, 1)`,
            borderWidth: 1,
          };
          ds.data.pop();
          sampleData.datasets.push(ds);
        });
        return this.sendResponse(req, res, {
          data: sd,
          status: 200,
        });
      case "activity":
        Object.keys(finalData).forEach((year) => {
          result[year] = {};
          Object.keys(finalData[year]).forEach((key) => {
            result[year][key] = finalData[year][key]?.done;
          });
        });
        sampleData.labels = Object.keys(result[Object.keys(result)[0]]).map(
          (i) => i.toUpperCase()
        );
        sampleData.datasets = [];
        Object.keys(result).forEach((key) => {
          const rgb = this.getRandomRGB();
          const ds = {
            label: key,
            data: Object.values(result[key]),
            backgroundColor: `rgba(${rgb}, 0.5)`,
            borderColor: `rgba(${rgb}, 1)`,
            borderWidth: 1,
          };
          sampleData.datasets.push(ds);
        });
        return this.sendResponse(req, res, {
          data: sd,
          status: 200,
        });
      case "library":
        Object.keys(finalData).forEach((year) => {
          result[year] = {};
          Object.keys(finalData[year]).forEach((key) => {
            result[year][key] = finalData[year][key];
          });
        });
        sampleData.labels = Object.keys(result[Object.keys(result)[0]]).map(
          (i) => i.toUpperCase()
        );

        sampleData.datasets = [];
        Object.keys(result).forEach((key) => {
          const rgb = this.getRandomRGB();
          const ds = {
            label: key,
            data: Object.values(result[key]),
            backgroundColor: `rgba(${rgb}, 0.5)`,
            borderColor: `rgba(${rgb}, 1)`,
            borderWidth: 1,
          };

          sampleData.datasets.push(ds);
        });
        return this.sendResponse(req, res, {
          data: sd,
          status: 200,
        });
      case "tanzeem":
        Object.keys(finalData).forEach((year) => {
          result[year] = {};
          Object.keys(finalData[year]).forEach((key) => {
            result[year][key] =
              finalData[year][key]?.start +
              finalData[year][key]?.increase -
              finalData[year][key]?.decrease;
          });
        });
        sampleData.labels = Object.keys(result[Object.keys(result)[0]]).map(
          (i) => i.toUpperCase()
        );

        sampleData.datasets = [];
        Object.keys(result).forEach((key) => {
          const rgb = this.getRandomRGB();
          const ds = {
            label: key,
            data: Object.values(result[key]),
            backgroundColor: `rgba(${rgb}, 0.5)`,
            borderColor: `rgba(${rgb}, 1)`,
            borderWidth: 1,
          };

          sampleData.datasets.push(ds);
        });
        return this.sendResponse(req, res, {
          data: sd,
          status: 200,
        });
      case "other-activity":
        Object.keys(finalData).forEach((year) => {
          result[year] = {};
          Object.keys(finalData[year]).forEach((key) => {
            result[year][key] = finalData[year][key];
          });
        });
        sampleData.labels = Object.keys(result[Object.keys(result)[0]]).map(
          (i) => i.toUpperCase()
        );

        sampleData.datasets = [];
        Object.keys(result).forEach((key) => {
          const rgb = this.getRandomRGB();
          const ds = {
            label: duration_type === "year" ? key : key.month,
            data: Object.values(result[key]),
            backgroundColor: `rgba(${rgb}, 0.5)`,
            borderColor: `rgba(${rgb}, 1)`,
            borderWidth: 1,
          };

          sampleData.datasets.push(ds);
        });
        return this.sendResponse(req, res, {
          data: sd,
          status: 200,
        });
    }
    return this.sendResponse(req, res, {
      message: "ok",
      status: 200,
    });
  };
  createDivisionReport = async (req, res, sampleData) => {
    const { property } = req.params;
    const { duration, duration_type, areaId } = req.body;
    const fields = {
      activity: "divisionActivityId",
      "other-activity": "otherActivityId",
      library: "maqamDivisionLibId",
      "ifradi-kuwat": "wiId",
      tanzeem: "maqamTanzeemId",
    };
    const db_data = {};
    switch (duration_type) {
      case "year":
        for (let i = 0; i < duration.length; i++) {
          const temp = await DivisionReportModel.find(
            {
              month: {
                $gte: new Date(duration[i] - 1, 12),
                $lte: new Date(duration[i], 12),
              },
              divisionAreaId: areaId,
            },
            fields[property]
          ).populate(fields[property]);
          db_data[duration[i]] = temp;
        }
        break;
      case "month":
        for (let i = 0; i < duration.length; i++) {
          const temp = await DivisionReportModel.find(
            {
              month: {
                $gte: new Date(duration[i].year, duration[i].month - 1),
                $lte: new Date(duration[i].year, duration[i].month),
              },
              divisionAreaId: areaId,
            },
            fields[property]
          ).populate(fields[property]);
          db_data[
            `${months[parseInt(duration[i].month)]}, ${duration[i].year}`
          ] = temp;
        }
        break;
    }
    // CALCULATION
    const finalData = {};
    Object.keys(db_data).map((key) => {
      const data_arr = db_data[key];
      let t_data = {};
      data_arr.forEach((val) => {
        const accessor = val?.[fields[property]]?._doc;
        delete accessor._id;
        delete accessor.__v;
        Object.keys(accessor).forEach((access_key) => {
          if (t_data?.[access_key]) {
            if (typeof accessor?.[access_key] === "object") {
              Object.keys(accessor?.[access_key]?._doc).forEach((i) => {
                t_data[access_key][i] += accessor?.[access_key]?.[i];
              });
            } else {
              t_data[access_key] += accessor?.[access_key];
            }
          } else {
            t_data[access_key] = accessor[access_key];
          }
        });
      });
      finalData[key] = t_data;
    });
    const result = {};
    const sd = sampleData;
    switch (property) {
      case "ifradi-kuwat":
        Object.keys(finalData).forEach((year) => {
          result[year] = {};
          Object.keys(finalData[year]).forEach((key) => {
            result[year][key] =
              finalData[year][key]?.start +
              finalData[year][key]?.increase -
              finalData[year][key]?.decrease;
          });
        });
        sampleData.labels = Object.keys(result[Object.keys(result)[0]]).map(
          (i) => i.toUpperCase()
        );
        sampleData.labels.pop();
        sampleData.datasets = [];
        Object.keys(result).forEach((key) => {
          const rgb = this.getRandomRGB();
          const ds = {
            label: key,
            data: Object.values(result[key]),
            backgroundColor: `rgba(${rgb}, 0.5)`,
            borderColor: `rgba(${rgb}, 1)`,
            borderWidth: 1,
          };
          ds.data.pop();
          sampleData.datasets.push(ds);
        });
        return this.sendResponse(req, res, {
          data: sd,
          status: 200,
        });
      case "activity":
        Object.keys(finalData).forEach((year) => {
          result[year] = {};
          Object.keys(finalData[year]).forEach((key) => {
            result[year][key] = finalData[year][key]?.done;
          });
        });
        sampleData.labels = Object.keys(result[Object.keys(result)[0]]).map(
          (i) => i.toUpperCase()
        );
        sampleData.datasets = [];
        Object.keys(result).forEach((key) => {
          const rgb = this.getRandomRGB();
          const ds = {
            label: key,
            data: Object.values(result[key]),
            backgroundColor: `rgba(${rgb}, 0.5)`,
            borderColor: `rgba(${rgb}, 1)`,
            borderWidth: 1,
          };
          sampleData.datasets.push(ds);
        });
        return this.sendResponse(req, res, {
          data: sd,
          status: 200,
        });
      case "library":
        Object.keys(finalData).forEach((year) => {
          result[year] = {};
          Object.keys(finalData[year]).forEach((key) => {
            result[year][key] = finalData[year][key];
          });
        });
        sampleData.labels = Object.keys(result[Object.keys(result)[0]]).map(
          (i) => i.toUpperCase()
        );

        sampleData.datasets = [];
        Object.keys(result).forEach((key) => {
          const rgb = this.getRandomRGB();
          const ds = {
            label: key,
            data: Object.values(result[key]),
            backgroundColor: `rgba(${rgb}, 0.5)`,
            borderColor: `rgba(${rgb}, 1)`,
            borderWidth: 1,
          };

          sampleData.datasets.push(ds);
        });
        return this.sendResponse(req, res, {
          data: sd,
          status: 200,
        });
      case "tanzeem":
        Object.keys(finalData).forEach((year) => {
          result[year] = {};
          Object.keys(finalData[year]).forEach((key) => {
            result[year][key] =
              finalData[year][key]?.start +
              finalData[year][key]?.increase -
              finalData[year][key]?.decrease;
          });
        });
        sampleData.labels = Object.keys(result[Object.keys(result)[0]]).map(
          (i) => i.toUpperCase()
        );

        sampleData.datasets = [];
        Object.keys(result).forEach((key) => {
          const rgb = this.getRandomRGB();
          const ds = {
            label: key,
            data: Object.values(result[key]),
            backgroundColor: `rgba(${rgb}, 0.5)`,
            borderColor: `rgba(${rgb}, 1)`,
            borderWidth: 1,
          };

          sampleData.datasets.push(ds);
        });
        return this.sendResponse(req, res, {
          data: sd,
          status: 200,
        });
      case "other-activity":
        Object.keys(finalData).forEach((year) => {
          result[year] = {};
          Object.keys(finalData[year]).forEach((key) => {
            result[year][key] = finalData[year][key];
          });
        });
        sampleData.labels = Object.keys(result[Object.keys(result)[0]]).map(
          (i) => i.toUpperCase()
        );

        sampleData.datasets = [];
        Object.keys(result).forEach((key) => {
          const rgb = this.getRandomRGB();
          const ds = {
            label: key,
            data: Object.values(result[key]),
            backgroundColor: `rgba(${rgb}, 0.5)`,
            borderColor: `rgba(${rgb}, 1)`,
            borderWidth: 1,
          };

          sampleData.datasets.push(ds);
        });
        return this.sendResponse(req, res, {
          data: sd,
          status: 200,
        });
    }
    return this.sendResponse(req, res, {
      message: "ok",
      status: 200,
    });
  };

  comparision = async (req, res) => {
    try {
      const { type, property } = req.params;
      const { duration, duration_type } = req.body;

      const valid_properties = [
        "activity",
        "other-activity",
        "library",
        "ifradi-kuwat",
        "tanzeem",
      ];

      const valid_duration_type = ["month", "year"];
      const sampleData = {
        labels: duration,
        datasets: [
          {
            label: `${duration_type}ly progress`,
            data: [0, 50, 120, 100, 200, 300],
            backgroundColor: "rgba(255, 0, 55, 0.5)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      };
      if (!duration_type) {
        return this.sendResponse(req, res, {
          message: "Duration type is required",
          status: 400,
        });
      }
      if (!valid_duration_type.includes(duration_type)) {
        return this.sendResponse(req, res, {
          message: "Duration type not valid. Valid types are: month or year",
          status: 400,
        });
      }
      if (!property) {
        return this.sendResponse(req, res, {
          message: "Property is required",
          status: 400,
        });
      }
      if (!valid_properties.includes(property)) {
        return this.sendResponse(req, res, {
          message:
            "Property type not valid. Valid types are: activity, other-activity, library, ifradi-kuwat",
          status: 400,
        });
      }
      if (!duration) {
        return this.sendResponse(req, res, {
          message: "Duration is required",
          status: 400,
        });
      }
      if (duration?.length < 2) {
        return this.sendResponse(req, res, {
          message: "Atleast 2 duration periods are required",
          status: 400,
        });
      }
      switch (type.toLowerCase()) {
        case "halqa":
          return this.createHalqaReport(req, res, sampleData);
        case "maqam":
          return this.createMaqamReport(req, res, sampleData);
        case "division":
          return this.createDivisionReport(req, res, sampleData);
      }
    } catch (err) {
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
}

module.exports = Compare;
