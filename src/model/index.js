const { UserModel } = require('./user');
const { RoleModel } = require('./roles');
const { HalqaModel } = require('./halqa');
const { TehsilModel } = require('./tehsil');
const { DistrictModel } = require('./district');
const { DivisionModel } = require('./division');
const { ProvinceModel } = require('./province');
const { MaqamModel } = require('./maqam');

module.exports = {
  RoleModel,
  UserModel,
  HalqaModel,
  TehsilModel,
  DistrictModel,
  DivisionModel,
  ProvinceModel,
  MaqamModel,
};
