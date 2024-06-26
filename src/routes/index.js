const router = require("express").Router();
const locations = require("./locations");
const user = require("./user");
const role = require("./role");
const reports = require("./reports");
const compare = require("./compare");
const notifications = require("./notifications");
const subjects = require("./subjects");
const comparison = require("./comparison");
const umeedwar = require("./umeedwar");
const compilation = require('./compilation');

router.use("/locations", locations);
router.use("/user", user);
router.use("/role", role);
router.use("/reports", reports);
router.use("/subjects", subjects);
router.use("/notifications", notifications);
router.use("/comparison", comparison);
router.use("/umeedwar", umeedwar);
router.use("/compilation", compilation);

module.exports = { router };
