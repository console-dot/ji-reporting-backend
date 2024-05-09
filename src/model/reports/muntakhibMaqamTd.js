const mongoose = require("mongoose");

const muntakhibMaqamTd = mongoose.Schema({
  // only for the muntakhib maqam report
  rawabitDecided: Number,
  uploadedCurrent: Number,
  manualCurrent: Number,
  currentSum: Number,
  rwabitMeetingsGoal: Number,
  uploadedMeetings: Number,
  manualMeetings: Number,
  meetingsSum: Number,
  uploadedLitrature: Number,
  manualLitrature: Number,
  literatureSum: Number,
  uploadedCommonStudentMeetings: Number,
  manualCommonStudentMeetings: Number,
  commonStudentMeetingsSum: Number,
  uploadedCommonLiteratureDistribution: Number,
  manualCommonLiteratureDistribution: Number,
  commonLiteratureDistributionSum: Number,
  registered: { type: Boolean, default: false },
});

const MuntakhibTdModel = mongoose.model("MuntakhibMaqamTd", muntakhibMaqamTd);

module.exports = { MuntakhibTdModel };
