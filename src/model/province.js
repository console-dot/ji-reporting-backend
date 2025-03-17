const mongoose = require("mongoose");

const province = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  country: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Country",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  activeDivisionCount: {
    type: Number,
  },
  activeDistrictCount: {
    type: Number,
  },
  activeTehsilCount: {
    type: Number,
  },
  activeMaqamCount: {
    type: Number,
  },
  activeIlaqaCount: {
    type: Number,
  },
  activeHalqaCount: {
    type: Number,
  },
  childDivisionIDs: [{ type: mongoose.Types.ObjectId, ref: "Division" }],
  childDistrictIDs: [{ type: mongoose.Types.ObjectId, ref: "District" }],
  childTehsilIDs: [{ type: mongoose.Types.ObjectId, ref: "Tehsil" }],
  childMaqamIDs: [{ type: mongoose.Types.ObjectId, ref: "Maqam" }],
  childIlaqaIDs: [{ type: mongoose.Types.ObjectId, ref: "Ilaqa" }],
  childHalqaIDs: [{ type: mongoose.Types.ObjectId, ref: "Halqa" }],
});

const ProvinceModel = mongoose.model("Province", province);

module.exports = {
  ProvinceModel,
};
