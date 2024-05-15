const { Province } = require("../../handlers/Locations");
const { isCountry } = require("../../middlewares");

const router = require("express").Router();

const handler = new Province();
router.post("/", isCountry, handler.createOne);
router.get("/",  handler.getAll);
router.get("/:id", isCountry, handler.getOne);
router.put("/:id", isCountry, handler.updateOne);
router.delete("/:id", isCountry, handler.deleteOne);

module.exports = router;
