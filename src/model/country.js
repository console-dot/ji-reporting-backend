const mongoose = require("mongoose");

const country = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  // Array of ObjectIds referencing related models
  activeProvinceCount: {
    type: Number,
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
  childProvinceIDs: [{ type: mongoose.Types.ObjectId, ref: "Province" }],
  childDivisionIDs: [{ type: mongoose.Types.ObjectId, ref: "Division" }],
  childDistrictIDs: [{ type: mongoose.Types.ObjectId, ref: "District" }],
  childTehsilIDs: [{ type: mongoose.Types.ObjectId, ref: "Tehsil" }],
  childMaqamIDs: [{ type: mongoose.Types.ObjectId, ref: "Maqam" }],
  childIlaqaIDs: [{ type: mongoose.Types.ObjectId, ref: "Ilaqa" }],
  childHalqaIDs: [{ type: mongoose.Types.ObjectId, ref: "Halqa" }],
});

const CountryModel = mongoose.model("Country", country);

module.exports = {
  CountryModel,
};
