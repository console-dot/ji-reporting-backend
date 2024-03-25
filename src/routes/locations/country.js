const { Country } = require("../../handlers/Locations");
const { isCountry } = require("../../middlewares");
const router = require("express").Router();

const handler = new Country();
router.post("/", isCountry, handler.createOne);
router.get("/", handler.getAll);
router.get("/:id", handler.getOne);
router.put("/:id", isCountry, handler.updateOne);
router.delete("/:id", isCountry, handler.deleteOne);

module.exports = router;
