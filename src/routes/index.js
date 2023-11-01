const router = require('express').Router();
const locations = require('./locations');
const user = require('./user');
const role = require('./role');

router.use('/locations', locations);
router.use('/user', user);
router.use('/role', role);

module.exports = { router };
