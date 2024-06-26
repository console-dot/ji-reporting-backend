const router = require("express").Router();
const { Report } = require("../../handlers");

const handler = new Report.MarkazReport();
router.get("/", handler.getReports);
router.get("/:id", handler.getSingleReport);
router.post("/", handler.createReport);
router.put("/:id", handler.editReport);
router.get("/data/filled-unfilled", handler.filledUnfilled);

module.exports = router;
