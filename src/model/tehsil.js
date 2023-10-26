const mongoose = require("mongoose");

const tehsil = mongoose.Schema({
  id: {
    type: Number,
  },

  name: {
    type: String,
    required: true,
  },
});

const Tehsil = mongoose.model("Tehsil", tehsil);

module.exports = {
  Tehsil,
};
