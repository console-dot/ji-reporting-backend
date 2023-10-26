const jwt = require("jsonwebtoken");
const { User } = require("../model");

const TOKEN_SECRET = "1234";
const route = require("express").Router();

const Login = async (req, res) => {
  const user = req.body;
  const userId = user.id;
  const pass = user.password;

  console.log(userId, pass);
  const isUser = await User.findOne({ employeeId: userId });
  if (isUser && isUser.status === "Active") {
    if (pass === isUser.password) {
      jwt.sign({ userId }, TOKEN_SECRET, { expiresIn: "1h" }, (err, token) => {
        if (err) {
          console.error("Error while generating token:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("token is genrated");
          return res.send({ token, user });
        }
      });
    } else {
      return res
        .status(200)
        .send({ status: 200, message: "not ok", data: null });
    }
  } else {
    if (isUser && isUser.status === "inActive") {
      return res.status(403).send({
        status: 403,
        message: "This user is not allowed to login",
        data: null,
      });
    }
    return res
      .status(404)
      .send({ message: "user not found", data: null, status: 404 });
  }
};
const refreshToken = (req, res) => {
  try {
    const token = req.headers["attendance"];
    const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) return err;
      return decode;
    });
    if (decoded?.name === "TokenExpiredError") {
      return this.sendResponse(
        res,
        "Authorization token is expired",
        null,
        400
      );
    }
    if (!decoded?.userId) {
      return this.sendResponse(res, "Error", decoded, 400);
    }
    const newToken = jwt.sign(
      { userId: decoded?.userId },
      { expiresIn: 60 * 10 + "s" }
    );
    return this.sendResponse(res, null, { token: newToken });
  } catch (err) {
    return this.sendResponse(res, "Internal server error", err, 500);
  }
};
const updatePassword = async (req, res) => {
  const { oldPass, newPass, confirmPass, employeeId } = req.body;
  try {
    const user = await User.findOne({ _id: employeeId });
    if (!user) {
      return res.status(404).send({
        status: 404,
        message: "The User with provided ID is not found",
        data: null,
      });
    } else {
      if (oldPass && newPass && confirmPass) {
        return res.status(404).send({
          status: 404,
          message: "Please provide all the necessary details",
          data: null,
        });
      } else {
        if (newPass !== confirmPass) {
          return res.status(404).send({
            status: 404,
            message: "New password and confirm password must be same",
            data: null,
          });
        } else {
          if (oldPass !== user.password) {
            return res.status(404).send({
              status: 404,
              message: "old password is not matching",
              data: null,
            });
          } else {
            await User.updateOne(
              { employeeId },
              {
                $set: {
                  password: newPass,
                },
              }
            );
          }
        }
      }
    }
  } catch {}
};

module.exports = { Login };
