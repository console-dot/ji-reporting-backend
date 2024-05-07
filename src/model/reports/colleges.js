const mongoose = require("mongoose");

const colleges = mongoose.Schema({
  collegesA: {
    type: {
      start: {
        type: Number,
        required: true,
      },
      increase: {
        type: Number,
        required: true,
      },
      end: {
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
  collegesB: {
    type: {
      start: {
        type: Number,
        required: true,
      },
      increase: {
        type: Number,
        required: true,
      },
      end: {
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
  collegesC: {
    type: {
      start: {
        type: Number,
        required: true,
      },
      increase: {
        type: Number,
        required: true,
      },
      end: {
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
  collegesD: {
    type: {
      start: {
        type: Number,
        required: true,
      },
      increase: {
        type: Number,
        required: true,
      },
      end: {
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

const CollegesModel = mongoose.model("colleges", colleges);

module.exports = { CollegesModel };
