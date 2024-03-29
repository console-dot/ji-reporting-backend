const { Role } = require("../handlers");

const router = require("express").Router();

const handler = new Role();

router.get("/", handler.getAll);
router.post("/", handler.create);
router.get("/:title", handler.getOne);
router.put("/:title", handler.update);

module.exports = router;
