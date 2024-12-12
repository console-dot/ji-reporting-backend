const mongoose = require("mongoose");

const division = mongoose.Schema({
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
  activeDistrictCount: {
    type: Number,
  },
  activeTehsilCount: {
    type: Number,
  },
  activeHalqaCount: {
    type: Number,
  },
  childDistrictIDs: [
    {
      type: mongoose.Types.ObjectId,
      ref: "District",
    },
  ],
  childTehsilIDs: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Tehsil",
    },
  ],
  childHalqaIDs: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Halqa",
    },
  ],
});

const DivisionModel = mongoose.model("Division", division);

module.exports = {
  DivisionModel,
};
