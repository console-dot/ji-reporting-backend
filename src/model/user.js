const mongoose = require('mongoose');

const users = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
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
      ref: 'Roles',
    },
    nazim: {
      type: String, // Halqa/Maqam/Division/Province
      required: true,
    },
    halqa: {
      type: mongoose.Types.ObjectId,
      ref: 'Halqa',
    },
    tehsil: {
      type: mongoose.Types.ObjectId,
      ref: 'Tehsil',
    },
    district: {
      type: mongoose.Types.ObjectId,
      ref: 'District',
    },
    division: {
      type: mongoose.Types.ObjectId,
      ref: 'Division',
    },
    province: {
      type: mongoose.Types.ObjectId,
      ref: 'Province',
    },
    userRequest: {
      type: mongoose.Types.ObjectId,
      ref: 'UserRequest',
      required: false,
    },
  },
  { timestamps: true } // For created_at and updated_at
);

const UserModel = mongoose.model('User', users);

module.exports = {
  UserModel,
};
