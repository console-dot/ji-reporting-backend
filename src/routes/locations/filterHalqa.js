const { FilterHalqas } = require("../../handlers/Locations");

const router = require("express").Router();

const handler = new FilterHalqas();
router.get("/", handler.getHalqas);

module.exports = router;
