const { User } = require('../handlers');

const router = require('express').Router();

const handler = new User();

router.post('/signup', handler.signup);
router.post('/login', handler.login);
router.post('/forget-password', handler.forgetPassword);
router.post('/reset-password', handler.resetPassword);
router.delete('/:id', handler.delete);
router.put('/:id', handler.update);
router.put('/change-password/:id', handler.updatePassword);
router.get('/user-requests', handler.getAllRequests);
router.patch('/user-requests/:id', handler.updateRequest);

module.exports = router;
