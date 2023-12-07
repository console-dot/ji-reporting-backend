const mongoose = require('mongoose');

const division = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  province: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Province',
  },
  disabled: {
    type: Boolean,
    default: false,
  }
});

const DivisionModel = mongoose.model('Division', division);

module.exports = {
  DivisionModel,
};
