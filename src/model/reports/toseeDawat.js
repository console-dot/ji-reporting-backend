const mongoose = require("mongoose");

const toseeDawatModel = mongoose.Schema({
  rawabitDecided: Number,
  uploadedCurrent: Number,
  manualCurrent: Number,
  rwabitMeetingsGoal: Number,
  uploadedMeetings: Number,
  manualMeetings: Number,
  uploadedLitrature: Number,
  manualLitrature: Number,
  uploadedCommonStudentMeetings: Number,
  manualCommonStudentMeetings: Number,
  uploadedCommonLiteratureDistribution: Number,
  manualCommonLiteratureDistribution: Number,
  registered: { type: Boolean, default: false },
});

const ToseeDawatModel = mongoose.model("ToseeDawat", toseeDawatModel);

module.exports = { ToseeDawatModel };
