const mongoose = require('mongoose');

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
      ref: 'Role',
    },
    nazim: {
      type: String, // Halqa/Maqam/Division/Province
      required: true,
    },
    userAreaId: {
      type: mongoose.Types.ObjectId,
      refPath: 'userAreaType',
    },
    userAreaType: {
      type: String,
      required: true,
      enum: ['District', 'Division', 'Halqa', 'Maqam', 'Province', 'Tehsil'],
    },
    userRequestId: {
      type: mongoose.Types.ObjectId,
      ref: 'UserRequest',
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // For created_at and updated_at
);

const UserModel = mongoose.model('User', users);

module.exports = {
  UserModel,
};
