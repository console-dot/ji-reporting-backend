const mongoose = require("mongoose");

const ilaqaReportModel = mongoose.Schema(
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
      ref: "User",
    },
    ilaqaAreaId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Ilaqa",
    },
    maqamTanzeemId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "MaqamTanzeem",
    },
    wiId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "WorkerInfo",
    },
    maqamActivityId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "MaqamActivities",
    },
    mentionedActivityId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "MentionedActivities",
    },
    otherActivityId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "OtherActivities",
    },
    tdId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "MuntakhibMaqamTd",
    },
    maqamDivisionLibId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "MaqamDivisionLibrary",
    },
    paighamDigestId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "IlaqaDigest",
    },
    baitulmalId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "BaitulMal",
    },
    rsdId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "RozShabBedari",
    },
  },
  { timestamps: true }
);

const IlaqaReportModel = mongoose.model("IlaqaReport", ilaqaReportModel);

module.exports = { IlaqaReportModel };
