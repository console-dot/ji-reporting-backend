const mongoose = require("mongoose");

const userRequest = mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    immediate_user_id: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "User",
    },
    nazimType: {
      type: String,
      enum: ["nazim", "umeedwar", "rukan", "umeedwaar-nazim", "rukan-nazim"],
    },
  },
  {
    timestamps: true,
  }
);

const UserRequest = mongoose.model("UserRequest", userRequest);

module.exports = {
  UserRequest,
};
