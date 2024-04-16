const mongoose = require("mongoose");

const ilaqa = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  maqam: {
    type: mongoose.Types.ObjectId,
    required: true,
    refPath: "parentType",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const IlaqaModel = mongoose.model("Ilaqa", ilaqa);

module.exports = {
  IlaqaModel,
};
