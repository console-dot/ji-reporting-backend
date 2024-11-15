const mongoose = require("mongoose");

const country = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  accessListIDs: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CountryAccessList",
  },
  provinceCount: {
    type: Number,
  },
  divisionCount: {
    type: Number,
  },
  districtCount: {
    type: Number,
  },
  tehsilCount: {
    type: Number,
  },
  maqamCount: {
    type: Number,
  },
  ilaqaCount: {
    type: Number,
  },
  halqaCount: {
    type: Number,
  },
});

const CountryModel = mongoose.model("Country", country);

module.exports = {
  CountryModel,
};
