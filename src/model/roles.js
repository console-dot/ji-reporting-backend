const mongoose = require("mongoose");

const roles = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  access: {
    type: {
      ro: [],
      rw: [],
    },
    default: {
      ro: [],
      rw: [],
    },
  },
});

const RoleModel = mongoose.model("Role", roles);

module.exports = {
  RoleModel,
};
