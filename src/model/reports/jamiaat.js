const mongoose = require("mongoose");

const jamiaat = mongoose.Schema({
  a: {
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
  b: {
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
  c: {
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
  d: {
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
  e: {
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

const JamiaatModel = mongoose.model("Jamiaat", jamiaat);

module.exports = { JamiaatModel };
