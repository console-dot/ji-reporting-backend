const mongoose = require("mongoose");

const roles = mongoose.Schema({
  id: {
    type: Number,
  },

  title: {
    type: String,
    required: true,
  },
  access: {
    type: Array,
    default: [],
  },
});

const Role = mongoose.model("Roles", roles);

module.exports = {
  Role,
};
