const mongoose = require("mongoose");

const markazWorkerInfo = mongoose.Schema({
  arkan: {
    type: {
      start: {
        type: Number,
        required: true,
      },
      manualStart: {
        type: Number,
        required: true,
      },
      increase: {
        type: Number,
        required: true,
      },
      manualIncrease: {
        type: Number,
        required: true,
      },
      decrease: {
        type: Number,
        required: true,
      },
      manualDecrease: {
        type: Number,
        required: true,
      },
      monthly: {
        type: Number,
        required: true,
      },
    },
    required: false,
  },
  umeedWaran: {
    type: {
      start: {
        type: Number,
        required: true,
      },
      manualStart: {
        type: Number,
        required: true,
      },
      increase: {
        type: Number,
        required: true,
      },
      manualIncrease: {
        type: Number,
        required: true,
      },
      decrease: {
        type: Number,
        required: true,
      },
      manualDecrease: {
        type: Number,
        required: true,
      },
      monthly: {
        type: Number,
        required: true,
      },
    },
    required: false,
  },
  rafaqa: {
    type: {
      start: {
        type: Number,
        required: true,
      },
      manualStart: {
        type: Number,
        required: true,
      },
      increase: {
        type: Number,
        required: true,
      },
      manualIncrease: {
        type: Number,
        required: true,
      },
      decrease: {
        type: Number,
        required: true,
      },
      manualDecrease: {
        type: Number,
        required: true,
      },
      monthly: {
        type: Number,
        required: true,
      },
    },
    required: false,
  },
  karkunan: {
    type: {
      start: {
        type: Number,
        required: true,
      },
      manualStart: {
        type: Number,
        required: true,
      },
      increase: {
        type: Number,
        required: true,
      },
      manualIncrease: {
        type: Number,
        required: true,
      },
      decrease: {
        type: Number,
        required: true,
      },
      manualDecrease: {
        type: Number,
        required: true,
      },
      monthly: {
        type: Number,
        required: true,
      },
    },
    required: false,
  },
  shaheen: {
    type: {
      start: {
        type: Number,
        required: true,
      },
      manualStart: {
        type: Number,
        required: true,
      },
      increase: {
        type: Number,
        required: true,
      },
      manualIncrease: {
        type: Number,
        required: true,
      },
      decrease: {
        type: Number,
        required: true,
      },
      manualDecrease: {
        type: Number,
        required: true,
      },
      monthly: {
        type: Number,
        required: true,
      },
    },
    required: false,
  },
  members: {
    type: {
      start: {
        type: Number,
        required: true,
      },
      manualStart: {
        type: Number,
        required: true,
      },
      increase: {
        type: Number,
        required: true,
      },
      manualIncrease: {
        type: Number,
        required: true,
      },
      decrease: {
        type: Number,
        required: true,
      },
      manualDecrease: {
        type: Number,
        required: true,
      },
      monthly: {
        type: Number,
        required: true,
      },
    },
    required: false,
  },
});

const MarkazWorkerInfoModel = mongoose.model("MarkazWorkerInfo", markazWorkerInfo);

module.exports = { MarkazWorkerInfoModel };
