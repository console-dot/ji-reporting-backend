const mongoose = require('mongoose');

const maqamDivisionLibraryModel = mongoose.Schema({
  totalLibraries: {
    type: Number,
    required: true,
  },
  totalBooks: {
    type: Number,
    required: true,
  },
  totalIncrease: {
    type: Number,
    required: true,
  },
  totalDecrease: {
    type: Number,
    required: true,
  },
  totalBookRent: {
    type: Number,
    required: true,
  },
});

const MaqamDivisionLibraryModel = mongoose.model(
  'MaqamDivisionLibrary',
  maqamDivisionLibraryModel
);

module.exports = { MaqamDivisionLibraryModel };
