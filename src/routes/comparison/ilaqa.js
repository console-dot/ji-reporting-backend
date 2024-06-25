const { IlaqaCompare } = require("../../handlers");

const router = require("express").Router();

const handler = new IlaqaCompare();

router.post("/:property", handler.main);

module.exports = router;
