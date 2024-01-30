const mongoose = require("mongoose");

const prayers = mongoose.Schema({
  namazFajar: {
    fajarTotal: { type: Number, required: true },
    fajarQaza: { type: Number, required: true },
    fajarOnTime: { type: Number, required: true },
    fajarInfradi: { type: Number, required: true },
  },
  otherNamaz: {
    otherPrayersTotal: { type: Number, required: true },
    otherPrayersQaza: { type: Number, required: true },
    otherPrayersOnTime: { type: Number, required: true },
    otherPrayersInfradi: { type: Number, required: true },
  },
});

const PrayersModel = mongoose.model("Prayers", prayers);
module.exports = {
  PrayersModel,
};
