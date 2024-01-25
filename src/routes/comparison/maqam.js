const { MaqamCompare } = require("../../handlers");

const router = require("express").Router();

const handler = new MaqamCompare();

router.post("/:property", handler.main);

module.exports = router;
