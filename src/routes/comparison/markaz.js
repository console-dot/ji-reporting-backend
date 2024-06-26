const { MarkazCompare } = require("../../handlers");

const router = require("express").Router();

const handler = new MarkazCompare();

router.post("/:property", handler.main);

module.exports = router;
