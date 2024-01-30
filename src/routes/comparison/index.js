const router = require("express").Router();
const Halqa = require("./halqa");
const Maqam = require("./maqam");
const Division = require("./division");
const Province = require("./province");
const Personal = require("./personal");

router.use("/halqa", Halqa);
router.use("/maqam", Maqam);
router.use("/division", Division);
router.use("/province", Province);
router.use("/personal", Personal);

module.exports = router;
