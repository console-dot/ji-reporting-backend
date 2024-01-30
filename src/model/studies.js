const mongoose = require("mongoose");

const studies = mongoose.Schema({
  tafseerQuran: {
    tafseerTotalRakoo: { type: Number, required: true },
    tafseerSurah: { type: String, required: true },
    tafseerTotalDays: { type: Number, required: true },
  },
  ahdees: {
    ahdeesTotalDays: { type: Number, required: true },
    ahdeesBook: { type: String, required: Number },
  },
  litrature: {
    litratureTotalDays: { type: Number, required: true },
    litratureBook: { type: String, required: true },
  },
  hifz: {
    hifzSurah: { type: String, required: true },
    hifzTotalDays: { type: Number, required: true },
  },
  institutionAttendance: {
    type: Number,
    required: true,
  },
});
const StudiesModel = mongoose.model("Studies", studies);
module.exports = { StudiesModel };
