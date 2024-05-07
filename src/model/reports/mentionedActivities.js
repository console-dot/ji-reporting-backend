const mongoose = require("mongoose");

const mentionedActivitiesModel = mongoose.Schema({
  ijtRafaqa: {
    type: {
      decided: { type: Number, required: true },
      done: { type: Number, required: true },
      averageAttendance: { type: Number, required: true },
      registered: {
        type: Boolean,
        default: false,
      },
      registered: {
        type: Boolean,
        default: false,
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
        default: false,
      },
    },
    required: true,
  },
  ijtKarkunan: {
    type: {
      decided: { type: Number, required: true },
      done: { type: Number, required: true },
      averageAttendance: { type: Number, required: true },
      manual: { type: Number, required: false },
      sum: { type: Number, required: false },
      registered: {
        type: Boolean,
        default: false,
      },
    },
    required: true,
  },
  darseQuran: {
    type: {
      decided: { type: Number, required: true },
      done: { type: Number, required: true },
      averageAttendance: { type: Number, required: true },
      manual: { type: Number, required: false },
      sum: { type: Number, required: false },
      registered: {
        type: Boolean,
        default: false,
      },
    },
    required: true,
  },
  shaheenMeeting: {
    type: {
      decided: { type: Number, required: true },
      done: { type: Number, required: true },
      averageAttendance: { type: Number, required: true },
      registered: {
        type: Boolean,
        default: false,
      },
    },
    required: true,
  },
  paighamEvent: {
    type: {
      decided: { type: Number, required: true },
      done: { type: Number, required: true },
      averageAttendance: { type: Number, required: true },
      registered: {
        type: Boolean,
        default: false,
      },
    },
    required: true,
  },
});

const MentionedActivitiesModel = mongoose.model(
  "MentionedActivities",
  mentionedActivitiesModel
);

module.exports = { MentionedActivitiesModel };
