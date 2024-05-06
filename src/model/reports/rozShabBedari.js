const mongoose = require("mongoose");

const rozShabBedariModel = mongoose.Schema({
  manualUmeedwaran: Number,
  uploadedUmeedwaran: Number,
  uploadedRafaqa: Number,
  manualRafaqa: Number,
});

const RozShabBedariModel = mongoose.model("RozShabBedari", rozShabBedariModel);

module.exports = { RozShabBedariModel };
