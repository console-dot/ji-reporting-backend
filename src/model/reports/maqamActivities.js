const mongoose = require('mongoose');

const maqamActivitiesModel = mongoose.Schema({
  divMushawarat:{
    type: {
      decided: { type: Number, required: true },
      done: { type: Number, required: true },
      averageAttendance: { type: Number, required: true },
      registered: {
        type: Boolean,
        default: false
      },
    },
  },
  ijtArkan: {
    type: {
      decided: { type: Number, required: true },
      done: { type: Number, required: true },
      averageAttendance: { type: Number, required: true },
      registered: {
        type: Boolean,
        default: false
      },
    },
    required: true,
  },
  studyCircle: {
    type: {
      decided: { type: Number, required: true },
      done: { type: Number, required: true },
      averageAttendance: { type: Number, required: true },
      registered: {
        type: Boolean,
        default: false
      },
    },
    required: true,
  },
  ijtNazmeen: {
    type: {
      decided: { type: Number, required: true },
      done: { type: Number, required: true },
      averageAttendance: { type: Number, required: true },
      registered: {
        type: Boolean,
        default: false
      },
    },
    required: true,
  },
  ijtUmeedwaran: {
    type: {
      decided: { type: Number, required: true },
      done: { type: Number, required: true },
      averageAttendance: { type: Number, required: true },
      registered: {
        type: Boolean,
        default: false
      },
    },
    required: true,
  },
  sadurMeeting: {
    type: {
      decided: { type: Number, required: true },
      done: { type: Number, required: true },
      averageAttendance: { type: Number, required: true },
      registered: {
        type: Boolean,
        default: false
      },
    },
    required: true,
  },
});

const MaqamActivitiesModel = mongoose.model(
  'MaqamActivities',
  maqamActivitiesModel
);

module.exports = { MaqamActivitiesModel };
