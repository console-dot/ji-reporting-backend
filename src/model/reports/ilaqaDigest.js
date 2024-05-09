const mongoose = require("mongoose");

const ilaqaDigest = mongoose.Schema({
  // only for the ilaqa report
  totalReceived: Number,
  manualReceived: Number,
  receivedSum: Number,
  totalSold: Number,
  manualSold: Number,
  soldSum: Number,
  monthlyReceivingGoal: Number,
  manualMonthlyReceivingGoal: Number,
  monthlyReceivingGoalSum: Number,
});

const IlaqaDigestModel = mongoose.model("IlaqaDigest", ilaqaDigest);

module.exports = { IlaqaDigestModel };
