const { UserModel } = require("./user");
const { RoleModel } = require("./roles");
const { HalqaModel } = require("./halqa");
const { TehsilModel } = require("./tehsil");
const { DistrictModel } = require("./district");
const { DivisionModel } = require("./division");
const { ProvinceModel } = require("./province");
const { MaqamModel } = require("./maqam");
const { ResetPasswordModel } = require("./resetPassword");
const HalqaReports = require("./reports");
const { NotificationsModal } = require("./notifications");
const { SubjectModal } = require("./subjects");
const { UmeedwarModel } = require("./umeedwarKhaka");
const { ItaatNazmModel } = require("./itaatNazm");
const { PrayersModel } = require("./prayers");
const { StudiesModel } = require("./studies");
const { ToseeDawaModel } = require("./toseeDawa");
const { CountryModel } = require("./country");
const { IlaqaModel } = require("./ilaqa");
const {AuditLogModel} = require("./auditLog");
const {ImageModel} =require("./image");
module.exports = {
  RoleModel,
  UserModel,
  HalqaModel,
  TehsilModel,
  DistrictModel,
  DivisionModel,
  ProvinceModel,
  MaqamModel,
  ImageModel,
  ResetPasswordModel,
  HalqaReports,
  NotificationsModal,
  SubjectModal,
  UmeedwarModel,
  PrayersModel,
  ItaatNazmModel,
  StudiesModel,
  ToseeDawaModel,
  CountryModel,
  IlaqaModel,
  AuditLogModel,
};
