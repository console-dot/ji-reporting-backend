const mongoose = require("mongoose");

const maqam = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  province: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Province",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  activeIlaqaCount: {
    type: Number,
  },
  activeHalqaCount: {
    type: Number,
  },
  childIlaqaIDs: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Ilaqa",
    },
  ],
  childHalqaIDs: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Halqa",
    },
  ],
});

const MaqamModel = mongoose.model("Maqam", maqam);

module.exports = {
  MaqamModel,
};
