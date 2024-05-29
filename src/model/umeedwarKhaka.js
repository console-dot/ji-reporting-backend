const mongoose = require("mongoose");

const umeedwarKhaka = mongoose.Schema(
  {
    comments: {
      type: String,
      required: false,
    },
    month: {
      type: Date,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    areaId: {
      type: mongoose.Types.ObjectId,
      refPath: "areaRef",
    },
    areaRef: {
      type: String,
      required: true,
      enum: ["Province", "Division", "Maqam", "Halqa", "Country", "Ilaqa"],
    },
    disturbingRoutine: {
      type: String,
      required: true,
    },
    prayersId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Prayers",
    },
    studiesId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Studies",
    },
    toseeDawaId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "ToseeDawa",
    },
    itaatNazmId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "ItaatNazm",
    },
  },
  { timestamps: true } // For created_at and updated_at
);

const UmeedwarModel = mongoose.model("Umeedwar", umeedwarKhaka);

module.exports = {
  UmeedwarModel,
};
