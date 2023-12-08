const mongoose = require("mongoose");

const notifications = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    created_for: {
      type: String,
      enum: ["halqa", "maqam", "division"],
    },
    parentId: {
      type: mongoose.Types.ObjectId,
      required: true,
      refPath: "parentType",
    },
    parentType: {
      type: String,
      required: true,
      enum: ["division", "maqam", "province"],
    },
  },
  { timestamps: true }
);

const Notifications = mongoose.model("notifications", notifications);

module.exports = {
  NotificationsModal: Notifications,
};
