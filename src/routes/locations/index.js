const router = require("express").Router();
const district = require("./district");
const division = require("./division");
const halqa = require("./halqa");
const maqam = require("./maqam");
const province = require("./province");
const tehsil = require("./tehsil");
const filterHalqas = require("./filterHalqa");
const ilaqa = require("./ilaqa");

router.use("/district", district);
router.use("/division", division);
router.use("/halqa", halqa);
router.use("/maqam", maqam);
router.use("/province", province);
router.use("/tehsil", tehsil);
router.use("/filter", filterHalqas);
router.use("/ilaqa", ilaqa);
module.exports = router;
