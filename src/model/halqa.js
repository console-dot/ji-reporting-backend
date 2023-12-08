const mongoose = require('mongoose');

const halqa = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  parentId: {
    type: mongoose.Types.ObjectId,
    required: true,
    refPath: 'parentType',
  },
  parentType: {
    type: String,
    required: true,
    enum: ['Tehsil', 'Maqam'],
  },
  disabled: {
    type: Boolean,
    default: false,
  }
});

const HalqaModel = mongoose.model('Halqa', halqa);

module.exports = {
  HalqaModel,
};
