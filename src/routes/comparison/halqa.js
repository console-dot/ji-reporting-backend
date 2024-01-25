const { HalqaCompare } = require("../../handlers");

const router = require("express").Router();

const handler = new HalqaCompare();

router.post("/:property", handler.main);

module.exports = router;
