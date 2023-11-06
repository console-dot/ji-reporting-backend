const router = require('express').Router();
const locations = require('./locations');
const user = require('./user');
const role = require('./role');
const reports = require('./reports');

router.use('/locations', locations);
router.use('/user', user);
router.use('/role', role);
router.use('/reports', reports);

module.exports = { router };
