const { District } = require("../../handlers/Locations");
const { isProvince } = require("../../middlewares");

const router = require("express").Router();

const handler = new District();
router.post("/", isProvince, handler.createOne);
router.get("/", handler.getAll);
router.get("/:id", handler.getOne);
router.put("/:id", isProvince, handler.updateOne);
router.delete("/:id", isProvince, handler.deleteOne);
router.patch("/disable-location/:id", isProvince, handler.toggleDisable);

module.exports = router;
