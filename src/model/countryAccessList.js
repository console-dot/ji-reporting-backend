const mongoose = require("mongoose");

const countryAccessListSchema = new mongoose.Schema({
  countryAccessList: [
    {
      type: mongoose.Schema.Types.ObjectId, // Stores ObjectIds without referencing another schema
    },
  ],
});

const CountryAccessListModel = mongoose.model(
  "CountryAccessList",
  countryAccessListSchema
);

module.exports = {
  CountryAccessListModel,
};
