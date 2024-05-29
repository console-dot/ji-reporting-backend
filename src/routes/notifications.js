const { Notifcations } = require("../handlers");

const router = require("express").Router();

const handler = new Notifcations();

router.post("/", handler.sendNotification);
router.get("/", handler.getNotifications);
router.patch("/:id", handler.updateNotifications);

module.exports = router;
