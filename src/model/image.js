
const mongoose = require('mongoose');


const imageSchema = new mongoose.Schema({
  data: { type: Buffer, required: true }, 
  contentType: { type: String, required: true }, 
});

const ImageModel = mongoose.model("Image", imageSchema);

module.exports = {
   ImageModel}
