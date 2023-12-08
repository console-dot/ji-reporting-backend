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
});

const TehsilModel = mongoose.model("Tehsil", tehsil);

module.exports = {
  TehsilModel,
};
