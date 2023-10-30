const { Maqam } = require('../../handlers/Locations');

const router = require('express').Router();

const handler = new Maqam();
router.post('/', handler.createOne);
router.get('/', handler.getAll);
router.get('/:id', handler.getOne);
router.put('/:id', handler.updateOne);
router.delete('/:id', handler.deleteOne);

module.exports = router;
