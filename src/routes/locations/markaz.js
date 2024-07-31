const { Country } = require("../../handlers/Locations");

const router = require("express").Router();

const handler = new Country();
router.post("/", handler.createOne);
router.get("/", handler.getOne);
router.put("/:id", handler.updateOne);
router.delete("/:id", handler.deleteOne);

module.exports = router;
