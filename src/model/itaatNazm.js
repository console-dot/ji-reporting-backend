const mongoose = require("mongoose");

const itaatNazm = mongoose.Schema({
  attended: {
    type: String,
    enum: ["yes", "no", "leave"],
    required: true,
  },
  attendedStudyCircle: {
    type: String,
    enum: ["yes", "no", "leave"],
    required: true,
  },
  aanat: {
    type: String,
    enum: ["yes", "no"],
    required: true,
  },
});
const ItaatNazmModel = mongoose.model("ItaatNazm", itaatNazm);
module.exports = { ItaatNazmModel };
