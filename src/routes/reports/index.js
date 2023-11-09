const router = require('express').Router();
const halqa = require('./halqa');

router.use('/halqa', halqa);

module.exports = router;
