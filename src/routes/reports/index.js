const router = require("express").Router();
const halqa = require("./halqa");
const maqam = require("./maqam");
const division = require("./division");
const province = require("./province");
const ilaqa = require("./ilaqa");

router.use("/halqa", halqa);
router.use("/maqam", maqam);
router.use("/division", division);
router.use("/province", province);
router.use("/ilaqa", ilaqa);
module.exports = router;
