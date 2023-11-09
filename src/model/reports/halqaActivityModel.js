const mongoose = require('mongoose');

const halqaActivityModel = mongoose.Schema({
  ijtRafaqa: {
    type: {
      decided: {
        type: Number,
        required: true,
      },
      completed: {
        type: Number,
        required: true,
      },
      attendance: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
    },
    required: false,
  },
  ijtKarkunan: {
    type: {
      decided: {
        type: Number,
        required: true,
      },
      completed: {
        type: Number,
        required: true,
      },
      attendance: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
    },
    required: false,
  },
  studyCircle: {
    type: {
      decided: {
        type: Number,
        required: true,
      },
      completed: {
        type: Number,
        required: true,
      },
      attendance: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
    },
    required: false,
  },
  darseQuran: {
    type: {
      decided: {
        type: Number,
        required: true,
      },
      completed: {
        type: Number,
        required: true,
      },
      attendance: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
    },
    required: false,
  },
});

const HalqaActivityModel = mongoose.model('HalqaActivity', halqaActivityModel);

module.exports = { HalqaActivityModel };