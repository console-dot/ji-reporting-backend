const mongoose = require("mongoose");

const ilaqa = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  maqam: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Maqam",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  activeHalqaCount: {
    type: Number,
  },
  childHalqaIDs: [{ type: mongoose.Types.ObjectId, ref: "Halqa" }],
});

const IlaqaModel = mongoose.model("Ilaqa", ilaqa);

module.exports = {
  IlaqaModel,
};
