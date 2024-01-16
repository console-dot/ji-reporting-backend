const mongoose = require("mongoose");

const users = mongoose.Schema(
  {
    email: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    role: {
      required: true,
      type: [mongoose.Types.ObjectId],
      ref: "Role",
    },
    nazim: {
      type: String, // Halqa/Maqam/Division/Province
      enum: ["halqa", "maqam", "division", "province"],
      required: true,
    },
    userAreaId: {
      type: mongoose.Types.ObjectId,
      refPath: "userAreaType",
    },
    userAreaType: {
      type: String,
      required: true,
      enum: ["District", "Division", "Halqa", "Maqam", "Province", "Tehsil"],
    },
    userRequestId: {
      type: mongoose.Types.ObjectId,
      ref: "UserRequest",
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    fatherName: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      enum: ["matric", "intermediate", "bachelors", "masters", "phd"],
    },
    subject: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Subject",
    },
    semester: {
      type: String,
      enum: [
        "semester 1",
        "semester 2",
        "semester 3",
        "semester 4",
        "semester 5",
        "semester 6",
        "semester 7",
        "semester 8",
        "semester 9",
        "semester 10",
        "semester 11",
        "semester 12",
        "1st year",
        "2nd year",
        "3rd year",
        "4th year",
        "5th year",
      ],
      required: true,
    },
    institution: {
      type: String,
      required: true,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    whatsAppNumber: {
      type: String,
      required: false,
    },
    nazimType: {
      type: String,
      enum: ["nazim", "umeedwar", "rukan", "umeedwaar-nazim", "rukan-nazim"],
    },
  },
  { timestamps: true } // For created_at and updated_at
);

const UserModel = mongoose.model("User", users);

module.exports = {
  UserModel,
};
