const router = require("express").Router();
const { Report } = require("../../handlers");

const handler = new Report.HalqaReport();
router.get("/", handler.getReports);
router.get("/:id", handler.getSingleReport);
router.post("/", handler.createReport);
router.put("/:id", handler.editReport);
router.get("/data/filled-unfilled", handler.filledUnfilled);
router.get("/data/all", handler.all);

module.exports = router;
