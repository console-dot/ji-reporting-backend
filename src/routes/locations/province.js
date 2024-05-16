const { Province } = require("../../handlers/Locations");
const { isCountry } = require("../../middlewares");

const router = require("express").Router();

const handler = new Province();
router.post("/", isCountry, handler.createOne);
router.get("/", handler.getAll);
router.get("/:id", handler.getOne);
router.put("/:id", handler.updateOne);
router.patch("/:id", handler.deleteOne);

module.exports = router;
