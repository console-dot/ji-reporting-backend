const { ProvinceCompare } = require("../../handlers");

const router = require("express").Router();

const handler = new ProvinceCompare();

router.post("/:property", handler.main);

module.exports = router;
