const router = require('express').Router();
const { Report } = require('../../handlers');

const handler = new Report.MaqamReport();
router.get('/', handler.getReports);
router.get('/:id', handler.getSingleReport);
router.post('/', handler.createReport);
router.put('/:id', handler.editReport);

module.exports = router;
