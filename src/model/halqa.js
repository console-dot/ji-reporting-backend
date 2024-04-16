const mongoose = require("mongoose");

const halqa = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  parentId: {
    type: mongoose.Types.ObjectId,
    required: true,
    refPath: "parentType",
  },
  parentType: {
    type: String,
    required: true,
    enum: ["Tehsil", "Maqam", "Division", "Ilaqa"],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  unitType: {
    type: String,
    default: "Residential",
  },
});

const HalqaModel = mongoose.model("Halqa", halqa);

module.exports = {
  HalqaModel,
};
