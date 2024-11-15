const { auditLogger } = require("../../middlewares/auditLogger");
const { ProvinceModel, CountryModel, UserModel } = require("../../model");
const Response = require("../Response");
const jwt = require("jsonwebtoken");

class Province extends Response {
  createOne = async (req, res) => {
    try {
      const { name, country } = req.body;
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
      const isExist = await ProvinceModel.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") }, // Case-insensitive check for name
      });

      if (isExist) {
        return this.sendResponse(req, res, {
          message: "Province already exists!",
          status: 400,
        });
      }

      const isCountry = await CountryModel.findOne({ name: country });
      if (isCountry) {
        const newProvince = new ProvinceModel({ name, country: isCountry._id });
        await newProvince.save();
        await auditLogger(
          userExist,
          "CREATED_PROVINCE",
          "A user Created Province",
          req
        );
        return this.sendResponse(req, res, {
          message: "Province created",
          status: 201,
        });
      }
      return this.sendResponse(req, res, {
        message: "No Country exists with this name",
        status: 404,
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
    try {
      const data = await ProvinceModel.find({});
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
      const data = await ProvinceModel.findOne({ _id });
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
      const _id = req.params.id;
      const data = req.body;
      const isCuntryExist = await CountryModel.findOne({ name: data?.country });
      data["country"] = isCuntryExist._id;
      const isExist = await ProvinceModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      if (isCuntryExist) {
        const updatedData = await ProvinceModel.updateOne(
          { _id },
          { $set: data }
        );
        if (updatedData?.modifiedCount > 0) {
          await auditLogger(
            userExist,
            "UPDATED_PROVINCE",
            "A user Updated Province",
            req
          );
          return this.sendResponse(req, res, {
            message: "Province updated",
            status: 200,
          });
        }
        return this.sendResponse(req, res, {
          message: "Nothing to update",
          status: 400,
        });
      }
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
      const token = req.body.headers.Authorization;

      const decoded = jwt.decode(token.split(" ")[1]);
      const userId = decoded?.id;
      const userExist = await UserModel.findOne({ _id: userId });
      if (!userExist) {
        return this.sendResponse(req, res, {
          message: "User not found!",
          status: 404,
        });
      }
      const _id = req.params.id;
      const isExist = await ProvinceModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }

      const updated = await ProvinceModel.updateOne(
        { _id: _id },
        { $set: { disabled: !isExist.disabled } }
      );

      if (updated.modifiedCount > 0) {
        await auditLogger(
          userExist,
          "DELETED_PROVINCE",
          "A user Deleted Province",
          req
        );
        return this.sendResponse(req, res, {
          message: "Province status updated",
          status: 200,
        });
      }

      return this.sendResponse(req, res, {
        message: "Can not update",
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
      // Step 1: Find the Halqa
      const isExist = await ProvinceModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      // Step 2: Update the Halqa
      const updatedLocation = await ProvinceModel.updateOne(
        { _id },
        {
          $set: { disabled },
        }
      );

      if (updatedLocation?.modifiedCount > 0) {
        // Step 3: Track the change direction (add or subtract)
        const changeValue = disabled ? -1 : 1;

        // Start with the current Halqa and move up the chain
        let province = isExist;
        if (province.country) {
          let country = await CountryModel.findById(province.country);
          if (country) {
            await CountryModel.updateOne(
              { _id: country._id },
              { $inc: { provinceCount: changeValue } }
            );
          }
        }

        return this.sendResponse(req, res, {
          message: "Maqam Updated",
          status: 200,
        });
      } else {
        return this.sendResponse(req, res, {
          message: "Nothing To Update",
          status: 200,
        });
      }
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
}

module.exports = Province;
