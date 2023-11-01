const mongoose = require("mongoose");

const maqam = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  province: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Province',
  },
});

const MaqamModel = mongoose.model("Maqam", maqam);

module.exports = {
  MaqamModel,
};
