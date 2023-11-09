const mongoose = require('mongoose');

const mentionedActivitiesModel = mongoose.Schema({
  ijtRafaqa: {
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
  ijtKarkunan: {
    type: {
      decided: { type: Number, required: true },
      done: { type: Number, required: true },
      averageAttendance: { type: Number, required: true },
    },
    required: true,
  },
  darseQuran: {
    type: {
      decided: { type: Number, required: true },
      done: { type: Number, required: true },
      averageAttendance: { type: Number, required: true },
    },
    required: true,
  },
  shaheenMeeting: {
    type: {
      decided: { type: Number, required: true },
      done: { type: Number, required: true },
      averageAttendance: { type: Number, required: true },
    },
    required: true,
  },
  paighamEvent: {
    type: {
      decided: { type: Number, required: true },
      done: { type: Number, required: true },
      averageAttendance: { type: Number, required: true },
    },
    required: true,
  },
});

const MentionedActivitiesModel = mongoose.model(
  'MentionedActivities',
  mentionedActivitiesModel
);

module.exports = { MentionedActivitiesModel };
