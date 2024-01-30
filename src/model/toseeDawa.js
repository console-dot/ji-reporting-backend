const mongoose = require("mongoose");

const toseeDawa = mongoose.Schema({
  rawabit: [
    {
      name: {
        type: String,
        required: true,
      },
      mobile: {
        type: String,
        required: true,
      },
      surahHifz: { required: true, type: String },
      totalVisitings: { required: true, type: Number },
      surahTafseer: { required: true, type: String },
      bookRead: { required: true, type: String },
      namazCondition: { required: true, type: String },
      programs: [{ type: String }],
    },
  ],
  regularStudents: {
    genralStudentsTotalMeetups: {
      type: Number,
      required: true,
    },
    genralStudentsTotalLitratureDivided: {
      type: Number,
      required: true,
    },
    genralStudentsCount: {
      type: Number,
      required: true,
    },
  },
});
const ToseeDawaModel = mongoose.model("ToseeDawa", toseeDawa);
module.exports = { ToseeDawaModel };
