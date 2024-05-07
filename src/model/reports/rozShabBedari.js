const mongoose = require("mongoose");

const rozShabBedariModel = mongoose.Schema({
  manualUmeedwaran: Number,
  umeedwaranFilled: Number,
  rafaqaFilled: Number,
});

const RozShabBedariModel = mongoose.model("RozShabBedari", rozShabBedariModel);

module.exports = { RozShabBedariModel };
