const router = require('express').Router();
const locations = require('./locations');
const user = require('./user');

router.use('/locations', locations);
router.use('/user', user);

module.exports = { router };
