const mongoose = require('mongoose');

const paighamDigestModel = mongoose.Schema({
  totalReceived: {
    type: Number,
    required: true,
  },
  totalSold: {
    type: Number,
    required: true,
  },
});

const PaighamDigestModel = mongoose.model('PaighamDigest', paighamDigestModel);

module.exports = { PaighamDigestModel };
