const {
  TehsilModel,
  UserModel,
  DistrictModel,
  ProvinceModel,
  CountryModel,
  DivisionModel,
} = require("../../model");
const Response = require("../Response");
const { auditLogger } = require("../../middlewares/auditLogger");
const jwt = require("jsonwebtoken");

class Tehsil extends Response {
  createOne = async (req, res) => {
    try {
      const { name, district } = req.body;
      const token = req.headers.authorization;
      const decoded = jwt.decode(token.split(" ")[1]);
      const userId = decoded?.id;
      const _id = userId;
      const userExist = await UserModel.findOne({ _id });
      if (!userExist) {
        return this.sendResponse(req, res, {
          message: "User not found!",
          status: 404,
        });
      }
      if (!name) {
        return this.sendResponse(req, res, {
          message: "Name is required!",
          status: 400,
        });
      }
      if (!district) {
        return this.sendResponse(req, res, {
          message: "District is required!",
          status: 400,
        });
      }
      const isExist = await TehsilModel.findOne({ name, district });
      if (isExist) {
        return this.sendResponse(req, res, {
          message: "Tehsil already exist!",
          status: 400,
        });
      }
      const newTehsil = new TehsilModel({ name, district });
      await newTehsil.save();
      await auditLogger(
        userExist,
        "TEHSIL_CREATED",
        "A user Created new Tehsil",
        req
      );
      return this.sendResponse(req, res, {
        message: "Tehsil created",
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
      const data = await TehsilModel.find({}).populate({
        path: "district",
        populate: { path: "division", populate: { path: "province" } },
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
      const data = await TehsilModel.findOne({ _id }).populate({
        path: "district",
        populate: { path: "division", populate: { path: "province" } },
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
      const isExist = await TehsilModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      const updatedData = await TehsilModel.updateOne({ _id }, { $set: data });
      if (updatedData?.modifiedCount > 0) {
        await auditLogger(
          userExist,
          "UPDATED_TEHSIL",
          "A user Updated Tehsil",
          req
        );
        return this.sendResponse(req, res, {
          message: "Tehsil updated",
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
      const isExist = await TehsilModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      const deleted = await TehsilModel.deleteOne({ _id });
      if (deleted?.deletedCount > 0) {
        await auditLogger(
          userExist,
          "DELETED_TEHSIL",
          "A user Delted Tehsil",
          req
        );
        return this.sendResponse(req, res, {
          message: "Tehsil deleted",
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
  //     const isExist = await TehsilModel.findOne({ _id });
  //     if (!isExist) {
  //       return this.sendResponse(req, res, {
  //         message: "Not found!",
  //         status: 404,
  //       });
  //     }
  //     const updatedLocation = await TehsilModel.updateOne(
  //       { _id },
  //       {
  //         $set: { disabled },
  //       }
  //     );
  //     if (updatedLocation?.modifiedCount > 0) {
  //       return this.sendResponse(req, res, {
  //         message: "Tehsil Updated",
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

      // Step 1: Find the Tehsil
      const isExist = await TehsilModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Tehsil not found!",
          status: 404,
        });
      }

      // Step 2: Update the Tehsil
      const updatedLocation = await TehsilModel.updateOne(
        { _id },
        { $set: { disabled } }
      );

      if (updatedLocation?.modifiedCount > 0) {
        // Step 3: Track the change direction (add or subtract)
        const changeValue = disabled ? -1 : 1;

        // Step 4: Update District, Division, Province, and Country hierarchy
        const district = await DistrictModel.findById(isExist.district);
        if (district) {
          // Update District tehsilCount
          await DistrictModel.updateOne(
            { _id: district._id },
            { $inc: { tehsilCount: changeValue } }
          );

          if (district.division) {
            const division = await DivisionModel.findById(district.division);
            if (division) {
              // Update Division tehsilCount
              await DivisionModel.updateOne(
                { _id: division._id },
                { $inc: { tehsilCount: changeValue } }
              );

              if (division.province) {
                const province = await ProvinceModel.findById(
                  division.province
                );
                if (province) {
                  // Update Province tehsilCount
                  await ProvinceModel.updateOne(
                    { _id: province._id },
                    { $inc: { tehsilCount: changeValue } }
                  );

                  if (province.country) {
                    const country = await CountryModel.findById(
                      province.country
                    );
                    if (country) {
                      // Update Country tehsilCount
                      await CountryModel.updateOne(
                        { _id: country._id },
                        { $inc: { tehsilCount: changeValue } }
                      );
                    }
                  }
                }
              }
            }
          }
        }

        // Step 5: Respond with success
        return this.sendResponse(req, res, {
          message: "Tehsil updated successfully!",
          status: 200,
        });
      }

      // Handle case where no updates were made
      return this.sendResponse(req, res, {
        message: "No changes made.",
        status: 400,
      });
    } catch (err) {
      console.error("Error in toggleDisable:", err);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
}

module.exports = Tehsil;
