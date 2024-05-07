const mongoose = require("mongoose");

const jamiaat = mongoose.Schema({
  jamiaatA: {
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
  jamiaatB: {
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
  jamiaatC: {
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
  jamiaatD: {
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
  jamiaatE: {
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
