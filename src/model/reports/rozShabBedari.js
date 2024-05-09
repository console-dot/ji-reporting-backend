const mongoose = require("mongoose");

const rozShabBedariModel = mongoose.Schema({
  umeedwaranFilled: Number,
  manualUmeedwaran: Number,
  umeedwaranFilledSum: Number,
  rafaqaFilled: Number,
  // only for the ilaqa reprt 
  manualRafaqaFilled: Number,
  rafaqaFilledSum: Number,
});

const RozShabBedariModel = mongoose.model("RozShabBedari", rozShabBedariModel);

module.exports = { RozShabBedariModel };
