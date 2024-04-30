const Response = require("../handlers/Response");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model");

const isCountry = async (req, res, next) => {
  const resp = new Response();
  try {
    const token = req.headers.authorization;
    if (!token) {
      return resp.sendResponse(req, res, {
        message: "Access Denied",
        status: 401,
      });
    }
    const decoded = jwt.decode(token.split(" ")[1]);
    const userId = decoded?.id;
    const { nazim } = await UserModel.findOne({
      _id: userId,
    });
    if (["country"].includes(nazim)) {
      next();
      return;
    }
    if (["maqam", "province", "division", "ilaqa", "halqa"].includes(nazim)) {
      return resp.sendResponse(req, res, {
        message: `loged in as ${nazim.toUpperCase()} User`,
        status: 200,
      });
    }
    return resp.sendResponse(req, res, {
      message: "Not super-user",
      status: 401,
    });
  } catch (err) {
    console.log(err);
    return resp.sendResponse(req, res, {
      message: "Internal Server Error",
      status: 500,
    });
  }
};

module.exports = { isCountry };
