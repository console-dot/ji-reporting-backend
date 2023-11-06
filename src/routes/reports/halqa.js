const router = require('express').Router();
const { Report } = require('../../handlers');

const handler = new Report.HalqaReport();
router.get('/', handler.getReports);
router.get('/:id', handler.getSingleReport);
router.post('/', handler.createReport);

module.exports = router;
