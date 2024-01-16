const { Subjects } = require("../handlers");

const router = require("express").Router();

const handler = new Subjects();

router.post("/", handler.create);
router.get("/", handler.getSubjects);
router.get("/:id", handler.getSubject);
router.patch("/", handler.updateSubjects);

module.exports = router;
