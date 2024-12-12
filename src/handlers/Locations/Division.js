const { auditLogger } = require("../../middlewares/auditLogger");
const {
  DivisionModel,
  UserModel,
  ProvinceModel,
  CountryModel,
} = require("../../model");
const Response = require("../Response");
const jwt = require("jsonwebtoken");

class Division extends Response {
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
      const isExist = await DivisionModel.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") }, // Case-insensitive check for name
        province,
      });

      if (isExist) {
        return this.sendResponse(req, res, {
          message: "Division already exists!",
          status: 400,
        });
      }
      const newDivision = new DivisionModel({ name, province });
      await newDivision.save();
      await addDivisionToHierarchy(newDivision._id, province);
      await auditLogger(
        userExist,
        "CREATED_DIVISION",
        "A user Created Division",
        req
      );
      return this.sendResponse(req, res, {
        message: "Division created",
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
        if (isUser && isUser.userAreaType === "Province") {
          data = await DivisionModel.find({
            province: isUser.userAreaId,
          }).populate("province");
        } else if (isUser?.userAreaType === "Country") {
          data = await DivisionModel.find({}).populate("province");
        }
      } else {
        data = await DivisionModel.find({}).populate("province");
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
      const data = await DivisionModel.findOne({ _id }).populate("province");
      if (!data) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      data.areaType = "Division";
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
      const isExist = await DivisionModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      const updatedData = await DivisionModel.updateOne(
        { _id },
        { $set: data }
      );
      if (updatedData?.modifiedCount > 0) {
        await auditLogger(
          userExist,
          "DIVISION_UPDATED",
          "A user Updated Division",
          req
        );
        return this.sendResponse(req, res, {
          message: "Division updated",
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
      const isExist = await DivisionModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      const deleted = await DivisionModel.deleteOne({ _id });
      if (deleted?.deletedCount > 0) {
        await auditLogger(
          userExist,
          "DELETED_DIVISION",
          "A user Deleted Division",
          req
        );
        return this.sendResponse(req, res, {
          message: "Division deleted",
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
  //     const isExist = await DivisionModel.findOne({ _id });
  //     if (!isExist) {
  //       return this.sendResponse(req, res, {
  //         message: "Not found!",
  //         status: 404,
  //       });
  //     }
  //     const updatedLocation = await DivisionModel.updateOne(
  //       { _id },
  //       {
  //         $set: { disabled },
  //       }
  //     );
  //     if (updatedLocation?.modifiedCount > 0) {
  //       return this.sendResponse(req, res, {
  //         message: "Division Updated",
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
      const isExist = await DivisionModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      // Step 2: Update the Halqa
      const updatedLocation = await DivisionModel.updateOne(
        { _id },
        {
          $set: { disabled },
        }
      );

      if (updatedLocation?.modifiedCount > 0) {
        // Step 3: Track the change direction (add or subtract)
        const changeValue = disabled ? -1 : 1;

        // Start with the current Halqa and move up the chain
        let currentDivision = isExist;

        if (currentDivision.province) {
          let province = await ProvinceModel.findById(currentDivision.province);
          if (province) {
            await ProvinceModel.updateOne(
              { _id: province._id },
              { $inc: { activeDivisionCount: changeValue } }
            );
            if (province.country) {
              let country = await CountryModel.findById(province.country);
              if (country) {
                await CountryModel.updateOne(
                  { _id: country._id },
                  { $inc: { activeDivisionCount: changeValue } }
                );
              }
            }
          }
        }

        return this.sendResponse(req, res, {
          message: "Division Updated",
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
const addDivisionToHierarchy = async (divisionId, provinceId) => {
  try {
    // Find the Province
    const province = await ProvinceModel.findById(provinceId);
    if (!province) {
      throw new Error(`Province with ID ${provinceId} not found.`);
    }

    // Update the Province's activeDivisionCount and childDivisionIDs
    await ProvinceModel.updateOne(
      { _id: province._id },
      {
        $push: { childDivisionIDs: divisionId },
        $inc: { activeDivisionCount: 1 },
      }
    );

    // Update the Country associated with the Province
    if (province.country) {
      await CountryModel.updateOne(
        { _id: province.country },
        {
          $push: { childDivisionIDs: divisionId },
          $inc: { activeDivisionCount: 1 },
        }
      );
    }
  } catch (error) {
    console.error("Error updating hierarchy for Division:", error);
  }
};

module.exports = Division;
