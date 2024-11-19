const { auditLogger } = require("../../middlewares/auditLogger");
const { UserModel, CountryModel } = require("../../model");
const { getRoleFlow } = require("../../utils");
const Response = require("../Response");
const jwt = require("jsonwebtoken");

class Country extends Response {
  createOne = async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return this.sendResponse(req, res, {
          message: "Name is required!",
          status: 400,
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

      const newMarkaz = new CountryModel({
        name,
      });
      await auditLogger(
        userExist,
        "CREATED_COUNTRY",
        "A user Created Markaz",
        req
      );
      await newMarkaz.save();
      return this.sendResponse(req, res, {
        message: "Country created",
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

  getOne = async (req, res) => {
    try {
      const country = await CountryModel.findOne();
      if (!country) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      let data = country;
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
      const isExist = await CountryModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      if (isExist) {
        const updatedData = await CountryModel.updateOne(
          { _id },
          { $set: data }
        );
        if (updatedData?.modifiedCount > 0) {
          return this.sendResponse(req, res, {
            message: "Country updated",
            status: 200,
          });
        }
        return this.sendResponse(req, res, {
          message: "Nothing to update",
          status: 400,
        });
      }

      if (updatedData?.modifiedCount > 0) {
        await auditLogger(
          userExist,
          "UPDATED_COUNTRY",
          "A user Updated Country",
          req
        );
        return this.sendResponse(req, res, {
          message: "Country updated",
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
      const isExist = await CountryModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      const deleted = await CountryModel.deleteOne({ _id });
      if (deleted?.deletedCount > 0) {
        await auditLogger(
          userExist,
          "DELETED_Country",
          "A user Deleted Country",
          req
        );
        return this.sendResponse(req, res, {
          message: "Markaz deleted",
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
}

module.exports = Country;
