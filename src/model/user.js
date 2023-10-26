const mongoose = require("mongoose");

const users = mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    unique: true,
  },
  role: {
    required: true,
    type: Array,
    default: [], // empty array means no permission by default (no user)
    ref: "Roles",
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true
  },
  nazim: {
    type: String, // Halqa/Maqam/Division
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  halqa: {
    required: true,
    type: Number,
    ref: "Halqa",
  },
  division: {
    required: true,
    type: Number,
    ref: "Division",
  },
  tehsil: {
    required: true,
    type: Number,
    ref: "Tehsil",
  },
  district: {
    required: true,
    type: Number,
    ref: "District",
  },
});

const User = mongoose.model("User", users);

module.exports = {
  User,
};
