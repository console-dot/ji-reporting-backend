const mongoose = require('mongoose');

const toseeDawatModel = mongoose.Schema({
  rawabitDecided: Number,
  current: Number,
  meetings: Number,
  literatureDistribution: Number,
  
  commonStudentMeetings: Number,
  commonLiteratureDistribution: Number,
});

const ToseeDawatModel = mongoose.model('ToseeDawat', toseeDawatModel);

module.exports = { ToseeDawatModel };
