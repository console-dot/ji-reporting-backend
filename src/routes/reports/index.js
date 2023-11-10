const router = require('express').Router();
const halqa = require('./halqa');
const maqam = require('./maqam');

router.use('/halqa', halqa);
router.use('/maqam', maqam);

module.exports = router;
