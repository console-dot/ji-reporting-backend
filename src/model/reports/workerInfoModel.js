const mongoose = require('mongoose');

const workerInfoModel = mongoose.Schema({
  arkan: {
    type: {
      start: {
        type: Number,
        required: true,
      },
      increase: {
        type: Number,
        required: true,
      },
      decrease: {
        type: Number,
        required: true,
      },
      annual: {
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
      increase: {
        type: Number,
        required: true,
      },
      decrease: {
        type: Number,
        required: true,
      },
      annual: {
        type: Number,
        required: true,
      },
      registered: {
        type: Boolean,
        default: false
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
      increase: {
        type: Number,
        required: true,
      },
      decrease: {
        type: Number,
        required: true,
      },
      annual: {
        type: Number,
        required: true,
      },
      registered: {
        type: Boolean,
        default: false
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
      increase: {
        type: Number,
        required: true,
      },
      decrease: {
        type: Number,
        required: true,
      },
      annual: {
        type: Number,
        required: true,
      },
      registered: {
        type: Boolean,
        default: false
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
      increase: {
        type: Number,
        required: true,
      },
      decrease: {
        type: Number,
        required: true,
      },
      annual: {
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
      increase: {
        type: Number,
        required: true,
      },
      decrease: {
        type: Number,
        required: true,
      },
      annual: {
        type: Number,
        required: true,
      },
    },
    required: false,
  },
  registered: { type: Boolean, default: false },
});

const WorkerInfoModel = mongoose.model('WorkerInfo', workerInfoModel);

module.exports = { WorkerInfoModel };
