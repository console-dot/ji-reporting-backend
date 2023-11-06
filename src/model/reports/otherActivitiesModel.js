const mongoose = require('mongoose');

const otherActivitiesModel = mongoose.Schema({
  dawatiWafud: Number,
  rawabitParties: Number,
  hadithCircle: Number,
  nazimSalah: Number,
  shabBedari: Number,
  anyOther: String,
});

const OtherActivitiesModel = mongoose.model(
  'OtherActivities',
  otherActivitiesModel
);

module.exports = { OtherActivitiesModel };
