const mongoose = require('mongoose');

const roles = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  access: {
    type: Array,
    default: [],
  },
});

const RoleModel = mongoose.model('Role', roles);

module.exports = {
  RoleModel,
};
