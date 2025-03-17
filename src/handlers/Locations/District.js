const { auditLogger } = require("../../middlewares/auditLogger");
const {
  DistrictModel,
  UserModel,
  DivisionModel,
  ProvinceModel,
  CountryModel,
} = require("../../model");
const Response = require("../Response");
const jwt = require("jsonwebtoken");

class District extends Response {
  createOne = async (req, res) => {
    try {
      const { name, division } = req.body;
      if (!name) {
        return this.sendResponse(req, res, {
          message: "Name is required!",
          status: 400,
        });
      }
      if (!division) {
        return this.sendResponse(req, res, {
          message: "Division is required!",
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
      const isExist = await DistrictModel.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") }, // Case-insensitive check for name
        division,
      });

      if (isExist) {
        return this.sendResponse(req, res, {
          message: "District already exists!",
          status: 400,
        });
      }
      const newDistrict = new DistrictModel({ name, division });
      await newDistrict.save();
      await addDistrictToHierarchy(newDistrict._id, division);
      await auditLogger(
        userExist,
        "CREATED_DISTRICT",
        "A user Created District",
        req
      );
      return this.sendResponse(req, res, {
        message: "District created",
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
    try {
      const data = await DistrictModel.find({}).populate({
        path: "division",
        populate: { path: "province" },
      });
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
      const data = await DistrictModel.findOne({ _id }).populate({
        path: "division",
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
      const isExist = await DistrictModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      const updatedData = await DistrictModel.updateOne(
        { _id },
        { $set: data }
      );
      if (updatedData?.modifiedCount > 0) {
        await auditLogger(
          userExist,
          "UPDATED_DISTRICT",
          "A user Updated District",
          req
        );
        return this.sendResponse(req, res, {
          message: "District updated",
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
      const isExist = await DistrictModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      const deleted = await DistrictModel.deleteOne({ _id });
      if (deleted?.deletedCount > 0) {
        await auditLogger(
          userExist,
          "DELETED_DISTRICT",
          "A user Deleted District",
          req
        );
        return this.sendResponse(req, res, {
          message: "District deleted",
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
  //     const isExist = await DistrictModel.findOne({ _id });
  //     if (!isExist) {
  //       return this.sendResponse(req, res, {
  //         message: "Not found!",
  //         status: 404,
  //       });
  //     }
  //     const updatedLocation = await DistrictModel.updateOne(
  //       { _id },
  //       {
  //         $set: { disabled },
  //       }
  //     );
  //     if (updatedLocation?.modifiedCount > 0) {
  //       return this.sendResponse(req, res, {
  //         message: "District Updated",
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
      const isExist = await DistrictModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      // Step 2: Update the Halqa
      const updatedLocation = await DistrictModel.updateOne(
        { _id },
        {
          $set: { disabled },
        }
      );

      if (updatedLocation?.modifiedCount > 0) {
        // Step 3: Track the change direction (add or subtract)
        const changeValue = disabled ? -1 : 1;

        // Start with the current Halqa and move up the chain
        let currentDistrict = isExist;
        if (currentDistrict.division) {
          // Step 4: If parentType is Ilaqa, update Ilaqa, Maqam, Province, and Country
          let division = await DivisionModel.findById(currentDistrict.division);
          if (division) {
            // Update Ilaqa halqaCount
            await DivisionModel.updateOne(
              { _id: division._id },
              { $inc: { activeDistrictCount: changeValue } }
            );

            // Now update Maqam, Province, and Country

            if (division.province) {
              let province = await ProvinceModel.findById(division.province);
              if (province) {
                await ProvinceModel.updateOne(
                  { _id: province._id },
                  { $inc: { activeDistrictCount: changeValue } }
                );
                if (province.country) {
                  let country = await CountryModel.findById(province.country);
                  if (country) {
                    await CountryModel.updateOne(
                      { _id: country._id },
                      { $inc: { activeDistrictCount: changeValue } }
                    );
                  }
                }
              }
            }
          }
        }

        return this.sendResponse(req, res, {
          message: "District Updated",
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
const addDistrictToHierarchy = async (districtId, divisionId) => {
  try {
    // Find the Division
    const division = await DivisionModel.findById(divisionId);
    if (!division) {
      throw new Error(`Division with ID ${divisionId} not found.`);
    }

    // Update the Division's activeDistrictCount and childDistrictIDs
    await DivisionModel.updateOne(
      { _id: division._id },
      {
        $push: { childDistrictIDs: districtId },
        $inc: { activeDistrictCount: 1 },
      }
    );

    // Find the Province associated with the Division
    const province = await ProvinceModel.findById(division.province);
    if (!province) {
      throw new Error(`Province not found for Division ID ${divisionId}.`);
    }

    // Update the Province's activeDistrictCount and childDistrictIDs
    await ProvinceModel.updateOne(
      { _id: province._id },
      {
        $push: { childDistrictIDs: districtId },
        $inc: { activeDistrictCount: 1 },
      }
    );

    // Update the Country associated with the Province
    if (province.country) {
      await CountryModel.updateOne(
        { _id: province.country },
        {
          $push: { childDistrictIDs: districtId },
          $inc: { activeDistrictCount: 1 },
        }
      );
    }
  } catch (error) {
    console.error("Error updating hierarchy for District:", error);
  }
};

module.exports = District;
