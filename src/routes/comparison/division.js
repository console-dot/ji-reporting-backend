const { DivisionCompare } = require("../../handlers");

const router = require("express").Router();

const handler = new DivisionCompare();

router.post("/:property", handler.main);

module.exports = router;
