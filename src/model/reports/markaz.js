const mongoose = require("mongoose");

const markazReport = mongoose.Schema(
  {
    comments: {
      type: String,
      required: false,
    },
    month: {
      type: Date,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    countryAreaId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Country",
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
    markazTanzeemId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "MaqamTanzeem",
    },
    markazWorkerInfoId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "MarkazWorkerInfo",
    },
    markazActivityId: {
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
      ref: "ToseeDawat",
    },
    markazDivisionLibId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "MaqamDivisionLibrary",
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

const MarkazReportModel = mongoose.model("MarkazReport", markazReport);

module.exports = { MarkazReportModel };
