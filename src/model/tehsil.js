const mongoose = require("mongoose");

const tehsil = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  district: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "District",
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

const TehsilModel = mongoose.model("Tehsil", tehsil);

module.exports = {
  TehsilModel,
};
