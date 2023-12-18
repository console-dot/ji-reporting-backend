const mongoose = require('mongoose');

const provinceReportModel = mongoose.Schema(
  {
    comments: {
      type: String,
      required: false,
    },
    month: {
      type: Date,
      required: true,
      unique: true
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    provinceAreaId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Province',
    },
    provinceTanzeemId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'MaqamTanzeem',
    },
    wiId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'WorkerInfo',
    },
    provinceActivityId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'MaqamActivities',
    },
    mentionedActivityId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'MentionedActivities',
    },
    otherActivityId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'OtherActivities',
    },
    tdId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'ToseeDawat',
    },
    provinceDivisionLibId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'MaqamDivisionLibrary',
    },
    paighamDigestId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'PaighamDigest',
    },
    rsdId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'RozShabBedari',
    },
  },
  { timestamps: true }
);

const ProvinceReportModel = mongoose.model('ProvinceReport', provinceReportModel);

module.exports = { ProvinceReportModel };
