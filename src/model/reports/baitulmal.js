const mongoose = require("mongoose");

const baitulmal = mongoose.Schema({
  monthlyIncome: Number,
  monthlyExpenditure: Number,
  savings: Number,
  loss: Number,
});

const BaitulmalModel = mongoose.model("BaitulMal", baitulmal);

module.exports = { BaitulmalModel };
