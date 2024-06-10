const { Compilation } = require("../handlers");

const router = require("express").Router();

const handler = new Compilation();

router.get("/:id", handler.getCompiledReports);

module.exports = router;