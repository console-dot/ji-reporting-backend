const { User } = require('../handlers');

const router = require('express').Router();

const handler = new User();

router.get('/me', handler.me);
router.get('/nazim', handler.getAllNazim);
router.post('/signup', handler.signup);
router.post('/login', handler.login);
router.post('/forget-password', handler.forgetPassword);
router.post('/reset-password', handler.resetPassword);
router.delete('/:id', handler.delete);
router.put('/', handler.update);
router.put('/change-password', handler.updatePassword);
router.get('/user-requests', handler.getAllRequests);
router.patch('/user-requests/:id', handler.updateRequest);
router.get('/un-filled/:id', handler.getUnfilledUsers);
router.get("/filter", handler.userSearchFilter);
module.exports = router;
