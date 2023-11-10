const mongoose = require('mongoose');

const maqamTanzeemModel = mongoose.Schema({
  rehaishHalqay: {
    type: {
      start: { type: Number, required: true },
      increase: { type: Number, required: true },
      decrease: { type: Number, required: true },
      continue: { type: Number, required: true },
      paused: { type: Number, required: true },
    },
    required: true,
  },
  taleemHalqay: {
    type: {
      start: { type: Number, required: true },
      increase: { type: Number, required: true },
      decrease: { type: Number, required: true },
      continue: { type: Number, required: true },
      paused: { type: Number, required: true },
    },
    required: true,
  },
  totalHalqay: {
    type: {
      start: { type: Number, required: true },
      increase: { type: Number, required: true },
      decrease: { type: Number, required: true },
      continue: { type: Number, required: true },
      paused: { type: Number, required: true },
    },
    required: true,
  },
  subRehaishHalqay: {
    type: {
      start: { type: Number, required: true },
      increase: { type: Number, required: true },
      decrease: { type: Number, required: true },
      continue: { type: Number, required: true },
      paused: { type: Number, required: true },
    },
    required: true,
  },
  subTaleemHalqay: {
    type: {
      start: { type: Number, required: true },
      increase: { type: Number, required: true },
      decrease: { type: Number, required: true },
      continue: { type: Number, required: true },
      paused: { type: Number, required: true },
    },
    required: true,
  },
  subTotalHalqay: {
    type: {
      start: { type: Number, required: true },
      increase: { type: Number, required: true },
      decrease: { type: Number, required: true },
      continue: { type: Number, required: true },
      paused: { type: Number, required: true },
    },
    required: true,
  },
  busmSchoolUnits: {
    type: {
      start: { type: Number, required: true },
      increase: { type: Number, required: true },
      decrease: { type: Number, required: true },
      continue: { type: Number, required: true },
      paused: { type: Number, required: true },
    },
    required: true,
  },
  busmRehaishUnits: {
    type: {
      start: { type: Number, required: true },
      increase: { type: Number, required: true },
      decrease: { type: Number, required: true },
      continue: { type: Number, required: true },
      paused: { type: Number, required: true },
    },
    required: true,
  },
  busmTotalUnits: {
    type: {
      start: { type: Number, required: true },
      increase: { type: Number, required: true },
      decrease: { type: Number, required: true },
      continue: { type: Number, required: true },
      paused: { type: Number, required: true },
    },
    required: true,
  },
});

const MaqamTanzeemModel = mongoose.model('MaqamTanzeem', maqamTanzeemModel);

module.exports = { MaqamTanzeemModel };
