const { User } = require('../handlers');

const router = require('express').Router();

const handler = new User();

router.post('/signup', handler.signup);

module.exports = router;
