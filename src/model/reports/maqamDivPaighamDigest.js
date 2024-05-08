const mongoose = require("mongoose");

const maqamDivPaighamDigestModel = mongoose.Schema({
  totalSold: {
    type: Number,
  },
  totalReceived: {
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

const MaqamDivPaighamDigestModel = mongoose.model(
  "MaqamDivPaighamDiges",
  maqamDivPaighamDigestModel
);

module.exports = { MaqamDivPaighamDigestModel };
