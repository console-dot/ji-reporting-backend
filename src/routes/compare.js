const { Compare } = require("../handlers");

const router = require("express").Router();

const handler = new Compare();

router.post("/:type/:property", handler.comparision);

module.exports = router;
