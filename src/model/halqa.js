const mongoose = require("mongoose");

const halqa = mongoose.Schema({
  id: {
    type: Number,
  },

  name: {
    type: String,
    required: true,
  },
});

const Halqa = mongoose.model("Halqa", halqa);

module.exports = {
  Halqa,
};
