const mongoose = require("mongoose");

const toseeDawatModel = mongoose.Schema({
  rawabitDecided: Number,
  current: Number,
  currentManual: Number,
  currentSum: Number,
  meetings: Number,
  meetingsManual: Number,
  meetingsSum: Number,
  rwabitMeetingsGoal: Number,
  literatureDistribution: Number,
  commonLiteratureDistribution: Number,
  commonStudentMeetings: Number,
  registered: { type: Boolean, default: false },
});

const ToseeDawatModel = mongoose.model("ToseeDawat", toseeDawatModel);

module.exports = { ToseeDawatModel };
