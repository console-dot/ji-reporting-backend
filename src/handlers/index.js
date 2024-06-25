const Locations = require("./Locations");
const User = require("./User");
const Role = require("./Role");
const Report = require("./Reports");
const Compare = require("./Compare");
const Notifcations = require("./Notifications");
const Subjects = require("./Subjects");
const UmeedWaar = require("./Umeedwar");
const Compilation = require("./Compilation");

const {
  HalqaCompare,
  MaqamCompare,
  DivisionCompare,
  ProvinceCompare,
  PersonalCompare,
  IlaqaCompare,
} = require("./Comparison");

module.exports = {
  Locations,
  User,
  Role,
  Report,
  Compare,
  Notifcations,
  Subjects,
  HalqaCompare,
  IlaqaCompare,
  MaqamCompare,
  DivisionCompare,
  ProvinceCompare,
  PersonalCompare,
  UmeedWaar,
  Compilation,
};
