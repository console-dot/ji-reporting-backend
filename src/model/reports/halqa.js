const mongoose = require('mongoose');

const halqaReportModel = mongoose.Schema(
  {
    comments: {
      type: String,
      required: false,
    },
    month: {
      type: Date,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    halqaAreaId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Halqa',
    },
    wiId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'WorkerInfo',
    },
    halqaActivityId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'HalqaActivity',
    },
    otherActivityId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'OtherActivities',
    },
    tdId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'ToseeDawat',
    },
    halqaLibId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'HalqaLibrary',
    },
    rsdId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'RozShabBedari',
    },
  },
  { timestamps: true }
);

const HalqaReportModel = mongoose.model('HalqaReport', halqaReportModel);

module.exports = { HalqaReportModel };
