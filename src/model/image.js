
const mongoose = require('mongoose');


const imageSchema = new mongoose.Schema({
  data: { type: Buffer, required: true }, 
  mimetype: { type: String, required: true }, 
  name: { type: String, required: false }, 

});

const ImageModel = mongoose.model("Image", imageSchema);

module.exports = {
   ImageModel}
