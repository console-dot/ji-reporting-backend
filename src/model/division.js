const mongoose = require("mongoose");

const division = mongoose.Schema({
  id: {
    type: Number,
  },

  name: {
    type: String,
    required: true,
  },
});

const Division = mongoose.model("Division", division);

module.exports = {
  Division,
};
