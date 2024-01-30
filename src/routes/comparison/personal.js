const { PersonalCompare } = require("../../handlers");

const router = require("express").Router();

const handler = new PersonalCompare();

router.post("/:property", handler.main);

module.exports = router;
