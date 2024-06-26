const mongoose = require("mongoose");

const divisionReportModel = mongoose.Schema(
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
    divisionAreaId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Division",
    },
    jamiaatId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Jamiaat",
    },
    collegesId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Colleges",
    },
    jamiaatId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Jamiaat",
    },
    collegesId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Colleges",
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
    divisionActivityId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "DivisionActivities",
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
      ref: "ToseeDawat",
    },
    maqamDivisionLibId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "MaqamDivisionLibrary",
    },
    paighamDigestId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "PaighamDigest",
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

const DivisionReportModel = mongoose.model(
  "DivisionReport",
  divisionReportModel
);

module.exports = { DivisionReportModel };
