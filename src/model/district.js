const mongoose = require("mongoose");

const district = mongoose.Schema({
  id: {
    type: Number,
  },

  name: {
    type: String,
    required: true,
  },
});

const District = mongoose.model("District", district);

module.exports = {
  District,
};
