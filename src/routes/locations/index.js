const router = require('express').Router();
const district = require('./district');
const division = require('./division');
const halqa = require('./halqa');
const maqam = require('./maqam');
const province = require('./province');
const tehsil = require('./tehsil');

router.use('/district', district);
router.use('/division', division);
router.use('/halqa', halqa);
router.use('/maqam', maqam);
router.use('/province', province);
router.use('/tehsil', tehsil);

module.exports = router;
