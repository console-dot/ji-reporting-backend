const mongoose = require('mongoose');

const maqamActivitiesModel = mongoose.Schema({
  ijtArkan: {
    type: {
      decided: { type: Number, required: true },
      done: { type: Number, required: true },
      averageAttendance: { type: Number, required: true },
    },
    required: true,
  },
  studyCircle: {
    type: {
      decided: { type: Number, required: true },
      done: { type: Number, required: true },
      averageAttendance: { type: Number, required: true },
    },
    required: true,
  },
  ijtNazmeen: {
    type: {
      decided: { type: Number, required: true },
      done: { type: Number, required: true },
      averageAttendance: { type: Number, required: true },
    },
    required: true,
  },
  ijtUmeedwaran: {
    type: {
      decided: { type: Number, required: true },
      done: { type: Number, required: true },
      averageAttendance: { type: Number, required: true },
    },
    required: true,
  },
  sadurMeeting: {
    type: {
      decided: { type: Number, required: true },
      done: { type: Number, required: true },
      averageAttendance: { type: Number, required: true },
    },
    required: true,
  },
});

const MaqamActivitiesModel = mongoose.model(
  'MaqamActivities',
  maqamActivitiesModel
);

module.exports = { MaqamActivitiesModel };
