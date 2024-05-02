const mongoose = require("mongoose");

const paighamDigestModel = mongoose.Schema({
  totalReceived: {
    type: Number,
  },
  totalSold: {
    type: Number,
  },
  monthlyReceivingGoal: {
    type: Number,
  },
  totalPrinted: {
    type: Number,
  },
  totalSoldMarket: {
    type: Number,
  },
  totalSoldTanzeemi: {
    type: Number,
  },
  gift: {
    type: Number,
  },
});

const PaighamDigestModel = mongoose.model("PaighamDigest", paighamDigestModel);

module.exports = { PaighamDigestModel };
