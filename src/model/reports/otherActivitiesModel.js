const mongoose = require('mongoose');

const otherActivitiesModel = mongoose.Schema({
  dawatiWafud: Number,
  rawabitParties: Number,
  hadithCircle: Number,
  nizamSalah: Number,
  shabBedari: Number,
  anyOther: String,
  tanzeemiRound: Number,
  tarbiyatGaah: Number
});

const OtherActivitiesModel = mongoose.model(
  'OtherActivities',
  otherActivitiesModel
);

module.exports = { OtherActivitiesModel };
