const mongoose = require('mongoose');

const divisionActivitiesModel = mongoose.Schema({
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

const DivisionActivitiesModel = mongoose.model(
  'DivisionActivities',
  divisionActivitiesModel
);

module.exports = { DivisionActivitiesModel };
