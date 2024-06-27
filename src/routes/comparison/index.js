const router = require("express").Router();
const Halqa = require("./halqa");
const Ilaqa = require("./ilaqa");
const Maqam = require("./maqam");
const Division = require("./division");
const Province = require("./province");
const Personal = require("./personal");
const Markaz = require("./markaz");

router.use("/halqa", Halqa);
router.use("/ilaqa", Ilaqa);
router.use("/maqam", Maqam);
router.use("/division", Division);
router.use("/province", Province);
router.use("/personal", Personal);
router.use("/markaz", Markaz);

module.exports = router;
