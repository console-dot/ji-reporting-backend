const { User } = require("../handlers");

const router = require("express").Router();

const handler = new User();

router.get("/me", handler.me);
router.get("/nazim", handler.getAllNazim);
router.post("/signup", handler.signup);
router.post("/login", handler.login);
router.post("/forget-password", handler.forgetPassword);
router.post("/reset", handler.resetPassword);
router.delete("/:id", handler.delete);
router.put("/", handler.update);
router.put("/update-status", handler.updateStatus);
router.put("/change-password", handler.updatePassword);
router.get("/user-requests", handler.getAllRequests);
router.patch("/user-requests/:id", handler.updateRequest);
router.get("/un-filled/:id", handler.getUnfilledUsers);
router.get("/filter", handler.userSearchFilter);
router.post("/upload", handler.upload);
router.put("/upload/:id", handler.updateImage);
router.get("/upload/:id", handler.getImage)
module.exports = router;
