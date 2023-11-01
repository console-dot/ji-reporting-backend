const mongoose = require('mongoose');

const province = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
});

const ProvinceModel = mongoose.model('Province', province);

module.exports = {
  ProvinceModel,
};
