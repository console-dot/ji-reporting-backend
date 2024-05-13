const mongoose = require("mongoose");

const markazWorkerInfo = mongoose.Schema({
  arkan: {
    type: {
      start: {
        type: Number,
        required: true,
      },
      manualStart: {
        default: 0,
        type: Number,
        required: true,
      },
      startSum: {
        default: 0,
        type: Number,
        required: true,
      },
      increase: {
        type: Number,
        required: true,
      },
      manualIncrease: {
        default: 0,
        type: Number,
        required: true,
      },
      increaseSum: {
        default: 0,
        type: Number,
        required: true,
      },
      decrease: {
        type: Number,
        required: true,
      },
      manualDecrease: {
        default: 0,
        type: Number,
        required: true,
      },
      decreaseSum: {
        default: 0,
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
        default: 0,
        type: Number,
        required: true,
      },
      startSum: {
        default: 0,
        type: Number,
        required: true,
      },
      increase: {
        type: Number,
        required: true,
      },
      manualIncrease: {
        default: 0,
        type: Number,
        required: true,
      },
      increaseSum: {
        default: 0,
        default: 0,
        type: Number,
        required: true,
      },
      decrease: {
        type: Number,
        required: true,
      },
      manualDecrease: {
        default: 0,
        type: Number,
        required: true,
      },
      decreaseSum: {
        default: 0,
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
        default: 0,
        type: Number,
        required: true,
      },
      startSum: {
        default: 0,
        type: Number,
        required: true,
      },
      increase: {
        type: Number,
        required: true,
      },
      manualIncrease: {
        default: 0,
        type: Number,
        required: true,
      },
      increaseSum: {
        default: 0,
        default: 0,
        type: Number,
        required: true,
      },
      decrease: {
        type: Number,
        required: true,
      },
      manualDecrease: {
        default: 0,
        type: Number,
        required: true,
      },
      decreaseSum: {
        default: 0,
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
        default: 0,
        type: Number,
        required: true,
      },
      startSum: {
        default: 0,
        type: Number,
        required: true,
      },
      increase: {
        type: Number,
        required: true,
      },
      manualIncrease: {
        default: 0,
        type: Number,
        required: true,
      },
      increaseSum: {
        default: 0,
        default: 0,
        type: Number,
        required: true,
      },
      decrease: {
        type: Number,
        required: true,
      },
      manualDecrease: {
        default: 0,
        type: Number,
        required: true,
      },
      decreaseSum: {
        default: 0,
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
        default: 0,
        type: Number,
        required: true,
      },
      startSum: {
        default: 0,
        type: Number,
        required: true,
      },
      increase: {
        type: Number,
        required: true,
      },
      manualIncrease: {
        default: 0,
        type: Number,
        required: true,
      },
      increaseSum: {
        default: 0,
        default: 0,
        type: Number,
        required: true,
      },
      decrease: {
        type: Number,
        required: true,
      },
      manualDecrease: {
        default: 0,
        type: Number,
        required: true,
      },
      decreaseSum: {
        default: 0,
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
        default: 0,
        type: Number,
        required: true,
      },
      startSum: {
        default: 0,
        type: Number,
        required: true,
      },
      increase: {
        type: Number,
        required: true,
      },
      manualIncrease: {
        default: 0,
        type: Number,
        required: true,
      },
      increaseSum: {
        default: 0,
        default: 0,
        type: Number,
        required: true,
      },
      decrease: {
        type: Number,
        required: true,
      },
      manualDecrease: {
        default: 0,
        type: Number,
        required: true,
      },
      decreaseSum: {
        default: 0,
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

const MarkazWorkerInfoModel = mongoose.model(
  "MarkazWorkerInfo",
  markazWorkerInfo
);

module.exports = { MarkazWorkerInfoModel };
