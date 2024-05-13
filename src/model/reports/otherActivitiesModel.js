const mongoose = require("mongoose");

const otherActivitiesModel = mongoose.Schema({
  dawatiWafud: Number,
  rawabitParties: Number,
  hadithCircle: Number,
  nizamSalah: Number,
  shabBedari: Number,
  anyOther: String,
  tanzeemiRound: Number,
  tarbiyatGaah: Number,
  tarbiyatGaahGoal: Number,
  tarbiyatGaahGoalManual: Number,
  tarbiyatGaahGoalSum: Number,
  tarbiyatGaahHeld: Number,
  tarbiyatGaahHeldManual: Number,
  tarbiyatGaahHeldSum: Number,
});

const OtherActivitiesModel = mongoose.model(
  "OtherActivities",
  otherActivitiesModel
);

module.exports = { OtherActivitiesModel };
