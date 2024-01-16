const mongoose = require("mongoose");

const subjectSchema = mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
});

const SubjectModal = mongoose.model("subject", subjectSchema);
module.exports = { SubjectModal };
