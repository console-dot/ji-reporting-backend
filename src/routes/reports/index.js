const router = require('express').Router();
const halqa = require('./halqa');
const maqam = require('./maqam');
const division = require('./division');

router.use('/halqa', halqa);
router.use('/maqam', maqam);
router.use('/division', division);

module.exports = router;
