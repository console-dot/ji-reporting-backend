const { UmeedWaar } = require("../handlers");
const router = require("express").Router();

const handler = new UmeedWaar();
router.post("/", handler.createReport);
router.get("/", handler.getUmeedWarReports);
router.get("/:id", handler.getUmeedWarSingleReport);
router.put("/:id", handler.updateUmeedwarReport);
module.exports = router;
