const { HalqaReportModel } = require('../model/reports');
const Response = require('./Response');

class Compare extends Response {
  getRandomRGB = () => {
    const r = Math.floor(Math.random() * 256); // Random red value between 0 and 255
    const g = Math.floor(Math.random() * 256); // Random green value between 0 and 255
    const b = Math.floor(Math.random() * 256); // Random blue value between 0 and 255

    return `${r}, ${g}, ${b}`;
  };
  createHalqaReport = async (req, res, sampleData) => {
    const { property } = req.params;
    const { duration, duration_type } = req.body;
    const fields = {
      activity: 'halqaActivityId',
      'other-activity': 'otherActivityId',
      library: 'halqaLibId',
      'ifradi-kuwat': 'wiId',
    };
    switch (duration_type) {
      case 'year':
        const db_data = {};
        for (let i = 0; i < duration.length; i++) {
          const temp = await HalqaReportModel.find(
            {
              month: {
                $gte: new Date(duration[i], 0, 1),
                $lte: new Date(duration[i], 11, 31),
              },
            },
            fields[property]
          ).populate(fields[property]);
          db_data[duration[i]] = temp;
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
                if (typeof accessor?.[access_key] === 'object') {
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
          case 'ifradi-kuwat':
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
          case 'activity':
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
          case 'library':
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
          case 'other-activity':
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
        }
    }
    return this.sendResponse(req, res, {
      message: 'ok',
      status: 200,
    });
  };
  comparision = async (req, res) => {
    const { type, property } = req.params;
    const { duration, duration_type } = req.body;
    const valid_properties = [
      'activity',
      'other-activity',
      'library',
      'ifradi-kuwat',
    ];
    const valid_duration_type = ['month', 'year'];
    const sampleData = {
      labels: duration,
      datasets: [
        {
          label: `${duration_type}ly progress`,
          data: [0, 50, 120, 100, 200, 300],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
    if (!duration_type) {
      return this.sendResponse(req, res, {
        message: 'Duration type is required',
        status: 400,
      });
    }
    if (!valid_duration_type.includes(duration_type)) {
      return this.sendResponse(req, res, {
        message: 'Duration type not valid. Valid types are: month or year',
        status: 400,
      });
    }
    if (!property) {
      return this.sendResponse(req, res, {
        message: 'Property is required',
        status: 400,
      });
    }
    if (!valid_properties.includes(property)) {
      return this.sendResponse(req, res, {
        message:
          'Property type not valid. Valid types are: activity, other-activity, library, ifradi-kuwat',
        status: 400,
      });
    }
    if (!duration) {
      return this.sendResponse(req, res, {
        message: 'Duration is required',
        status: 400,
      });
    }
    if (duration?.length < 2) {
      return this.sendResponse(req, res, {
        message: 'Atleast 2 duration periods are required',
        status: 400,
      });
    }
    switch (type.toLowerCase()) {
      case 'halqa':
        return this.createHalqaReport(req, res, sampleData);
    }
  };
}

module.exports = Compare;
