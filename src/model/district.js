const mongoose = require("mongoose");

const district = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  division: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Division",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  tehsilCount: {
    type: Number,
  },
  halqaCount: {
    type: Number,
  },
});

const DistrictModel = mongoose.model("District", district);

module.exports = {
  DistrictModel,
};
