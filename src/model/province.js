const mongoose = require('mongoose');

const province = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  country: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Country",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const ProvinceModel = mongoose.model('Province', province);

module.exports = {
  ProvinceModel,
};
