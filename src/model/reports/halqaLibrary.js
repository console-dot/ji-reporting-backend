const mongoose = require('mongoose');

const halqaLibraryModel = mongoose.Schema({
  books: Number,
  increase: Number,
  decrease: Number,
  bookRent: Number,
  registered: { type: Boolean, default: false },
});

const HalqaLibraryModel = mongoose.model('HalqaLibrary', halqaLibraryModel);

module.exports = { HalqaLibraryModel };
