const mongoose = require("mongoose");

const maqamDivToseeDawat = mongoose.Schema({
  rawabitDecided: Number,
  uploadedCurrent: Number,
  manualCurrent: Number,
  rwabitMeetingsGoal: Number,
  uploadedMeetings: Number,
  manualMeetings: Number,
  litrature: Number,
  commonStudentLiterature: Number,
  commonStudentMeetings: Number,

  registered: { type: Boolean, default: false },
});

const MaqamDivToseeDawatModel = mongoose.model(
  "MaqamDivToseeDawat",
  maqamDivToseeDawat
);

module.exports = { MaqamDivToseeDawatModel };
