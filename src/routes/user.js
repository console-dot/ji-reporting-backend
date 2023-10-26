const { signIn, signUp, forgotPassword } = require("../handlers");
const { isAdmin } = require("../middleware");

const router = require("express").Router();

router.post("/signIn", isAdmin, signIn);
router.post("/signUp", isAdmin, signUp);
router.post("/forgotPassword", forgotPassword);

module.exports = {
  user: router,
};