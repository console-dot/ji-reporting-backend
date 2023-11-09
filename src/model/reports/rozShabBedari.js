const mongoose = require('mongoose');

const rozShabBedariModel = mongoose.Schema({
  umeedwaranFilled: Number,
  rafaqaFilled: Number,
});

const RozShabBedariModel = mongoose.model('RozShabBedari', rozShabBedariModel);

module.exports = { RozShabBedariModel };
