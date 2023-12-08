const router = require("express").Router();
const locations = require("./locations");
const user = require("./user");
const role = require("./role");
const reports = require("./reports");
const compare = require("./compare");
const notifications = require("./notifications");

router.use("/locations", locations);
router.use("/user", user);
router.use("/role", role);
router.use("/reports", reports);
router.use("/compare", compare);
router.use("/notifications", notifications);

module.exports = { router };
