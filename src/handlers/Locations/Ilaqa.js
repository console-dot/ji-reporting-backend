const { auditLogger } = require("../../middlewares/auditLogger");
const { IlaqaModel, MaqamModel, UserModel } = require("../../model");
const Response = require("../Response");
const jwt = require("jsonwebtoken");

class Ilaqa extends Response {
  createOne = async (req, res) => {
    try {
      const token = req.headers.authorization;
      const decoded = jwt.decode(token.split(" ")[1]);
      const userId = decoded?.id;
      const userExist = await UserModel.findOne({ _id: userId });
      if (!userExist) {
        return this.sendResponse(req, res, {
          message: "User not found!",
          status: 404,
        });
      }
      const { name, maqam } = req.body;
      if (!name) {
        return this.sendResponse(req, res, {
          message: "Name is required!",
          status: 400,
        });
      }
      if (!maqam) {
        return this.sendResponse(req, res, {
          message: "Maqam is required!",
          status: 400,
        });
      }
      const isExist = await IlaqaModel.findOne({ name, maqam });
      if (isExist) {
        return this.sendResponse(req, res, {
          message: "Ilaqa already exist!",
          status: 400,
        });
      }
      const newIlaqa = new IlaqaModel({ name, maqam });
      await newIlaqa.save();
      await auditLogger(
        userExist,
        "CREATED_IlAQA",
        "A user Created Ilaqa",
        req
      );
      return this.sendResponse(req, res, {
        message: "Ilaqa created",
        status: 201,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  getAll = async (req, res) => {
    const token = req.headers.authorization;
    let data;
    try {
      if (token) {
        const decoded = jwt.decode(token.split(" ")[1]);
        const userId = decoded?.id;
        const isUser = await UserModel.findOne({
          _id: userId,
        });
        if (isUser && isUser.userAreaType === "Maqam") {
          data = await IlaqaModel.find({ maqam: isUser.userAreaId }).populate({
            path: "maqam",
            populate: { path: "province" },
          });
        } else if (isUser && isUser.userAreaType === "Province") {
          const maqamsList = await MaqamModel.find({
            province: isUser.userAreaId,
          }).select("_id");
          data = await IlaqaModel.find({ maqam: maqamsList }).populate({
            path: "maqam",
            populate: { path: "province" },
          });
        } else if (isUser.userAreaType === "Country") {
          data = await IlaqaModel.find({}).populate({
            path: "maqam",
            populate: { path: "province" },
          });
        }
      } else {
        data = await IlaqaModel.find({}).populate({
          path: "maqam",
          populate: { path: "province" },
        });
      }
      return this.sendResponse(req, res, { data, status: 200 });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  getOne = async (req, res) => {
    try {
      const _id = req.params.id;
      const data = await IlaqaModel.findOne({ _id }).populate({
        path: "maqam",
        populate: { path: "province" },
      });
      if (!data) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      return this.sendResponse(req, res, { data, status: 200 });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  updateOne = async (req, res) => {
    try {
      const _id = req.params.id;
      const data = req.body;
      const token = req.headers.authorization;
      const decoded = jwt.decode(token.split(" ")[1]);
      const userId = decoded?.id;
      const userExist = await UserModel.findOne({ _id: userId });
      if (!userExist) {
        return this.sendResponse(req, res, {
          message: "User not found!",
          status: 404,
        });
      }
      const isExist = await IlaqaModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      const updatedData = await IlaqaModel.updateOne({ _id }, { $set: data });
      if (updatedData?.modifiedCount > 0) {
        await auditLogger(
          userExist,
          "UPDATED_ILAQA",
          "A user Updated Ilaqa",
          req
        );
        return this.sendResponse(req, res, {
          message: "Ilaqa updated",
          status: 200,
        });
      }
      return this.sendResponse(req, res, {
        message: "Nothing to update",
        status: 400,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  deleteOne = async (req, res) => {
    try {
      const _id = req.params.id;
      const isExist = await IlaqaModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      const token = req.headers.authorization;
      const decoded = jwt.decode(token.split(" ")[1]);
      const userId = decoded?.id;
      const userExist = await UserModel.findOne({ _id: userId });
      if (!userExist) {
        return this.sendResponse(req, res, {
          message: "User not found!",
          status: 404,
        });
      }
      const deleted = await IlaqaModel.deleteOne({ _id });
      if (deleted?.deletedCount > 0) {
        await auditLogger(
          userExist,
          "ILAQA_DELETED",
          "A user Deleted Ilaqa",
          req
        );
        return this.sendResponse(req, res, {
          message: "Ilaqa deleted",
          status: 200,
        });
      }
      return this.sendResponse(req, res, {
        message: "Can not delete",
        status: 400,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  toggleDisable = async (req, res) => {
    try {
      const _id = req.params.id;
      const { disabled } = req.body;
      const isExist = await IlaqaModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      const updatedLocation = await IlaqaModel.updateOne(
        { _id },
        {
          $set: { disabled },
        }
      );
      if (updatedLocation?.modifiedCount > 0) {
        return this.sendResponse(req, res, {
          message: "Ilaqa Updated",
          status: 200,
        });
      }
      return this.sendResponse(req, res, {
        message: "Nothing to update",
        status: 400,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
}

module.exports = Ilaqa;
