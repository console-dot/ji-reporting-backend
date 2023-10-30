const { UserModel } = require('./user');
const { Roles } = require('./roles');
const { HalqaModel } = require('./halqa');
const { TehsilModel } = require('./tehsil');
const { DistrictModel } = require('./district');
const { DivisionModel } = require('./division');
const { ProvinceModel } = require('./province');
const { MaqamModel } = require('./maqam');

module.exports = {
  Roles,
  UserModel,
  HalqaModel,
  TehsilModel,
  DistrictModel,
  DivisionModel,
  ProvinceModel,
  MaqamModel,
};
