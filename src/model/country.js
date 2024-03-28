const mongoose = require("mongoose");

const country = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
});

const CountryModel = mongoose.model("Country", country);

module.exports = {
  CountryModel,
};
