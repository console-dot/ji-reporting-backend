const { HalqaReportModel } = require('./halqa');
const { HalqaActivityModel } = require('./halqaActivityModel');
const { HalqaLibraryModel } = require('./halqaLibrary');
const { OtherActivitiesModel } = require('./otherActivitiesModel');
const { RozShabBedariModel } = require('./rozShabBedari');
const { ToseeDawatModel } = require('./toseeDawat');
const { WorkerInfoModel } = require('./workerInfoModel');
const { MaqamTanzeemModel } = require('./maqamTanzeem');
const { MaqamActivitiesModel } = require('./maqamActivities');
const { MentionedActivitiesModel } = require('./mentionedActivities');
const { MaqamDivisionLibraryModel } = require('./maqamDivisionLibrary');
const { PaighamDigestModel } = require('./paighamDigest');
const { MaqamReportModel } = require('./maqam');
const { DivisionActivitiesModel } = require('./divisionActivities');
const { DivisionReportModel } = require('./division');
const {ProvinceReportModel} = require('./province');
module.exports = {
  HalqaActivityModel,
  HalqaLibraryModel,
  HalqaReportModel,
  OtherActivitiesModel,
  RozShabBedariModel,
  ToseeDawatModel,
  WorkerInfoModel,
  MaqamTanzeemModel,
  MaqamActivitiesModel,
  MentionedActivitiesModel,
  MaqamDivisionLibraryModel,
  PaighamDigestModel,
  MaqamReportModel,
  DivisionActivitiesModel,
  DivisionReportModel,
  ProvinceReportModel
};
