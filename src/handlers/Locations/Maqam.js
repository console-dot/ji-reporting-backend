const { auditLogger } = require("../../middlewares/auditLogger");
const {
  MaqamModel,
  DivisionModel,
  UserModel,
  CountryModel,
  ProvinceModel,
} = require("../../model");
const Response = require("../Response");
const jwt = require("jsonwebtoken");

class Maqam extends Response {
  createOne = async (req, res) => {
    try {
      const { name, province } = req.body;
      if (!name) {
        return this.sendResponse(req, res, {
          message: "Name is required!",
          status: 400,
        });
      }
      if (!province) {
        return this.sendResponse(req, res, {
          message: "Province is required!",
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
      const isExist = await MaqamModel.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") }, // Case-insensitive check for name
        province,
      });

      if (isExist) {
        return this.sendResponse(req, res, {
          message: "Maqam already exists!",
          status: 400,
        });
      }

      const newMaqam = new MaqamModel({ name, province });
      await newMaqam.save();
      await auditLogger(
        userExist,
        "CREATED_MAQAM",
        "A user Created Maqam",
        req
      );
      return this.sendResponse(req, res, {
        message: "Maqam created",
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
    try {
      let data;
      if (token) {
        const decoded = jwt.decode(token.split(" ")[1]);
        const userId = decoded?.id;
        const isUser = await UserModel.findOne({
          _id: userId,
        });
        if (isUser && isUser.userAreaType === "Province") {
          data = await MaqamModel.find({
            province: isUser.userAreaId,
          }).populate("province");
        } else if (isUser.userAreaType === "Country") {
          data = await MaqamModel.find({}).populate("province");
        }
      } else {
        data = await MaqamModel.find({}).populate("province");
      }
      if (!data?.length > 0) {
        data = [];
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
      let data;
      data = await MaqamModel.findOne({ _id }).populate("province");
      if (data) {
        const keys = Object.keys(data._doc);
        keys.push("areaType");
        keys?.forEach((doc) => {
          if (doc === "areaType") {
            data._doc[doc] = "Maqam";
          }
        });
      } else {
        data = await DivisionModel.findOne({ _id }).populate("province");
        if (data) {
          const keys = Object.keys(data._doc);
          keys.push("areaType");
          keys?.forEach((doc) => {
            if (doc === "areaType") {
              data._doc[doc] = "Division";
            }
          });
        }
      }
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
      const isExist = await MaqamModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      const updatedData = await MaqamModel.updateOne({ _id }, { $set: data });
      if (updatedData?.modifiedCount > 0) {
        await auditLogger(
          userExist,
          "UPDATED_MAQAM",
          "A user Updated Maqam",
          req
        );
        return this.sendResponse(req, res, {
          message: "Maqam updated",
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
      const isExist = await MaqamModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      const deleted = await MaqamModel.deleteOne({ _id });
      if (deleted?.deletedCount > 0) {
        await auditLogger(
          userExist,
          "DELETED_MAQAM",
          "A user Deleted Maqam",
          req
        );
        return this.sendResponse(req, res, {
          message: "Maqam deleted",
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
  // toggleDisable = async (req, res) => {
  //   try {
  //     const _id = req.params.id;
  //     const { disabled } = req.body;
  //     const isExist = await MaqamModel.findOne({ _id });
  //     if (!isExist) {
  //       return this.sendResponse(req, res, {
  //         message: "Not found!",
  //         status: 404,
  //       });
  //     }
  //     const updatedLocation = await MaqamModel.updateOne(
  //       { _id },
  //       {
  //         $set: { disabled },
  //       }
  //     );
  //     if (updatedLocation?.modifiedCount > 0) {
  //       return this.sendResponse(req, res, {
  //         message: "Maqam Updated",
  //         status: 200,
  //       });
  //     }
  //     return this.sendResponse(req, res, {
  //       message: "Nothing to update",
  //       status: 400,
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     return this.sendResponse(req, res, {
  //       message: "Internal Server Error",
  //       status: 500,
  //     });
  //   }
  // };

  toggleDisable = async (req, res) => {
    try {
      const _id = req.params.id;
      const { disabled } = req.body;
      // Step 1: Find the Halqa
      const isExist = await MaqamModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      // Step 2: Update the Halqa
      const updatedLocation = await MaqamModel.updateOne(
        { _id },
        {
          $set: { disabled },
        }
      );

      if (updatedLocation?.modifiedCount > 0) {
        // Step 3: Track the change direction (add or subtract)
        const changeValue = disabled ? -1 : 1;

        // Start with the current Halqa and move up the chain
        let currentMaqam = isExist;

        if (currentMaqam.province) {
          let province = await ProvinceModel.findById(currentMaqam.province);
          if (province) {
            await ProvinceModel.updateOne(
              { _id: province._id },
              { $inc: { maqamCount: changeValue } }
            );
            if (province.country) {
              let country = await CountryModel.findById(province.country);
              if (country) {
                await CountryModel.updateOne(
                  { _id: country._id },
                  { $inc: { maqamCount: changeValue } }
                );
              }
            }
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

module.exports = Maqam;
