const { auditLogger } = require("../../middlewares/auditLogger");
const {
  HalqaModel,
  UserModel,
  IlaqaModel,
  MaqamModel,
  ProvinceModel,
  CountryModel,
  DivisionModel,
  DistrictModel,
  TehsilModel,
} = require("../../model");
const { getRoleFlow } = require("../../utils");
const Response = require("../Response");
const jwt = require("jsonwebtoken");

class Halqa extends Response {
  createOne = async (req, res) => {
    try {
      const { name, parentId, parentType, unitType } = req.body;
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
      if (!unitType) {
        return this.sendResponse(req, res, {
          message: "Type of halqa is required!",
          status: 400,
        });
      }
      if (!parentType) {
        return this.sendResponse(req, res, {
          message: "Parent type is required",
          status: 400,
        });
      }
      if (!parentId) {
        return this.sendResponse(req, res, {
          message:
            parentType === "maqam"
              ? "Maqam is required!"
              : parentType === "ilaqa"
              ? "Ilaqa is required"
              : "Tehsil is required!",
          status: 400,
        });
      }
      const isExist = await HalqaModel.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") }, // Case-insensitive check for name
        parentId,
        parentType,
      });

      if (isExist) {
        return this.sendResponse(req, res, {
          message: "Halqa already exists!",
          status: 400,
        });
      }
      const newHalqa = new HalqaModel({
        name,
        parentId,
        parentType,
        unitType,
      });

      await newHalqa.save();
      await addHalqaToParentHierarchy(newHalqa._id, parentId, parentType);
      await auditLogger(
        userExist,
        "CREATED_HALQA",
        "A user Created Halqa",
        req
      );
      return this.sendResponse(req, res, {
        message: "Halqa created",
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

  // Function to populate halqas
  populateHalqas = async (halqas, populateOptions) => {
    const populatePromises = [];

    for (const halqa of halqas) {
      const options = populateOptions[halqa.parentType];
      if (options) {
        for (const opt of options) {
          populatePromises.push(HalqaModel.populate(halqa, opt));
        }
      }
    }

    await Promise.all(populatePromises);
  };
  // Function to chunk array into batches
  chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };
  // Function to retrieve halqas with population
  getAll = async (req, res) => {
    const token = req.headers.authorization;

    let halqaData;
    try {
      if (token) {
        const decoded = jwt.decode(token.split(" ")[1]);
        const userId = decoded?.id;
        const isUser = await UserModel.findOne({
          _id: userId,
        });
        if (isUser && isUser.userAreaType === "Ilaqa") {
          const halqaList = await getRoleFlow(isUser.userAreaId, "Ilaqa");
          halqaData = await HalqaModel.find({ parentId: halqaList }).populate(
            "parentId"
          );
        } else if (isUser && isUser.userAreaType === "Maqam") {
          const halqaList = await getRoleFlow(isUser.userAreaId, "Maqam");
          halqaData = await HalqaModel.find({ parentId: halqaList }).populate(
            "parentId"
          );
        } else if (isUser && isUser.userAreaType === "Division") {
          const halqaList = await getRoleFlow(isUser.userAreaId, "Division");
          halqaData = await HalqaModel.find({ parentId: halqaList }).populate(
            "parentId"
          );
        } else if (isUser && isUser.userAreaType === "Province") {
          const halqaList = await getRoleFlow(isUser.userAreaId, "Province");
          halqaData = await HalqaModel.find({ parentId: halqaList }).populate(
            "parentId"
          );
        } else if (isUser && isUser.userAreaType === "Country") {
          halqaData = await HalqaModel.find({}).populate("parentId");
        }
      } else {
        halqaData = await HalqaModel.find({}).populate("parentId");
      }
      // const populateOptions = {
      //   Tehsil: [
      //     {
      //       path: "parentId",
      //       populate: {
      //         path: "district",
      //         populate: { path: "division", populate: { path: "province" } },
      //       },
      //     },
      //   ],
      //   Maqam: [{ path: "parentId", populate: { path: "province" } }],
      //   Division: [{ path: "parentId", populate: { path: "province" } }],
      //   Ilaqa: [
      //     {
      //       path: "parentId",
      //       populate: { path: "maqam", populate: { path: "province" } },
      //     },
      //   ],
      // };

      // Define batch size for parallel processing
      // const batchSize = 500;

      // await Promise.all(
      //   this.chunkArray(halqaData, batchSize).map((batch) =>
      //     this.populateHalqas(batch, populateOptions)
      //   )
      // );
      return this.sendResponse(req, res, { data: halqaData, status: 200 });
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
      const halqaData = await HalqaModel.findOne({ _id });
      if (!halqaData) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      let data = halqaData;
      const populateOptions = {
        Tehsil: [
          {
            path: "parentId",
            populate: {
              path: "district",
              populate: { path: "division", populate: { path: "province" } },
            },
          },
        ],
        Maqam: [{ path: "parentId", populate: { path: "province" } }],
        Division: [{ path: "parentId", populate: { path: "province" } }],
        Ilaqa: [
          {
            path: "parentId",
            populate: { path: "maqam", populate: { path: "province" } },
          },
        ],
      };

      data = await halqaData.populate(populateOptions[halqaData?.parentType]);

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
      const isExist = await HalqaModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      if (isExist) {
        const updatedData = await HalqaModel.updateOne({ _id }, { $set: data });
        if (updatedData?.modifiedCount > 0) {
          return this.sendResponse(req, res, {
            message: "Halqa updated",
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
          "UPDATED_HALQA",
          "A user Updated Halqa",
          req
        );
        return this.sendResponse(req, res, {
          message: "Halqa updated",
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
      const isExist = await HalqaModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      const deleted = await HalqaModel.deleteOne({ _id });
      if (deleted?.deletedCount > 0) {
        await auditLogger(
          userExist,
          "DELETED_HALQA",
          "A user Deleted Ilaqa",
          req
        );
        return this.sendResponse(req, res, {
          message: "Halqa deleted",
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
  //     const isExist = await HalqaModel.findOne({ _id });
  //     if (!isExist) {
  //       return this.sendResponse(req, res, {
  //         message: "Not found!",
  //         status: 404,
  //       });
  //     }
  //     const updatedLocation = await HalqaModel.updateOne(
  //       { _id },
  //       {
  //         $set: { disabled },
  //       }
  //     );
  //     if (updatedLocation?.modifiedCount > 0) {
  //       return this.sendResponse(req, res, {
  //         message: "Halqa Updated",
  //         status: 200,
  //       });
  //     }
  //     return this.sendResponse(req, res, {
  //       message: "Wait! Too many requests",
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
      const isExist = await HalqaModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }

      // Step 2: Update the Halqa
      const updatedLocation = await HalqaModel.updateOne(
        { _id },
        {
          $set: { disabled },
        }
      );

      if (updatedLocation?.modifiedCount > 0) {
        try {
          const changeValue = disabled ? -1 : 1;

          // Start with the current Halqa and move up the chain
          let currentHalqa = isExist;

          if (currentHalqa.parentType === "Ilaqa" && currentHalqa.parentId) {
            // Step 4: If parentType is Ilaqa, update Ilaqa, Maqam, Province, and Country
            let ilaqa = await IlaqaModel.findById(currentHalqa.parentId);
            if (ilaqa) {
              // Update Ilaqa halqaCount
              await IlaqaModel.updateOne(
                { _id: ilaqa._id },
                { $inc: { activeHalqaCount: changeValue } }
              );

              // Now update Maqam, Province, and Country
              if (ilaqa.maqam) {
                let maqam = await MaqamModel.findById(ilaqa.maqam);
                if (maqam) {
                  await MaqamModel.updateOne(
                    { _id: maqam._id },
                    { $inc: { activeHalqaCount: changeValue } }
                  );
                  if (maqam.province) {
                    let province = await ProvinceModel.findById(maqam.province);
                    if (province) {
                      await ProvinceModel.updateOne(
                        { _id: province._id },
                        { $inc: { activeHalqaCount: changeValue } }
                      );
                      if (province.country) {
                        let country = await CountryModel.findById(
                          province.country
                        );
                        if (country) {
                          await CountryModel.updateOne(
                            { _id: country._id },
                            { $inc: { activeHalqaCount: changeValue } }
                          );
                        }
                      }
                    }
                  }
                }
              }
            }
          } else if (
            currentHalqa.parentType === "Maqam" &&
            currentHalqa.parentId
          ) {
            // Step 5: If parentType is Maqam, update Maqam, Province, and Country
            let maqam = await MaqamModel.findById(currentHalqa.parentId);
            if (maqam) {
              // Update Maqam halqaCount
              await MaqamModel.updateOne(
                { _id: maqam._id },
                { $inc: { activeHalqaCount: changeValue } }
              );

              // Now update Province and Country
              if (maqam.province) {
                let province = await ProvinceModel.findById(maqam.province);
                if (province) {
                  await ProvinceModel.updateOne(
                    { _id: province._id },
                    { $inc: { activeHalqaCount: changeValue } }
                  );
                  if (province.country) {
                    let country = await CountryModel.findById(province.country);
                    if (country) {
                      await CountryModel.updateOne(
                        { _id: country._id },
                        { $inc: { activeHalqaCount: changeValue } }
                      );
                    }
                  }
                }
              }
            }
          } else if (
            currentHalqa.parentType === "Division" &&
            currentHalqa.parentId
          ) {
            try {
              let division = await DivisionModel.findById(
                currentHalqa.parentId
              );
              if (division) {
                // Update Division halqaCount
                await DivisionModel.updateOne(
                  { _id: division._id },
                  { $inc: { activeHalqaCount: changeValue } }
                );

                // Now update Province and Country
                if (division.province) {
                  let province = await ProvinceModel.findById(
                    division.province
                  );
                  if (province) {
                    await ProvinceModel.updateOne(
                      { _id: province._id },
                      { $inc: { activeHalqaCount: changeValue } }
                    );
                    if (province.country) {
                      let country = await CountryModel.findById(
                        province.country
                      );
                      if (country) {
                        await CountryModel.updateOne(
                          { _id: country._id },
                          { $inc: { activeHalqaCount: changeValue } }
                        );
                      }
                    }
                  }
                }
              }
            } catch (error) {
              console.log(error);
            }
          } else if (
            currentHalqa.parentType === "Tehsil" &&
            currentHalqa.parentId
          ) {
            let tehsil = await TehsilModel.findById(currentHalqa.parentId);
            if (tehsil) {
              // Update Tehsil halqaCount
              await TehsilModel.updateOne(
                { _id: tehsil._id },
                { $inc: { activeHalqaCount: changeValue } }
              );

              // Now update District, Division, Province, and Country
              if (tehsil.district) {
                let district = await DistrictModel.findById(tehsil.district);
                if (district) {
                  // District does not have a halqaCount, so move to Division
                  if (district.division) {
                    let division = await DivisionModel.findById(
                      district.division
                    );
                    if (division) {
                      await DivisionModel.updateOne(
                        { _id: division._id },
                        { $inc: { activeHalqaCount: changeValue } }
                      );

                      // Now update Province and Country
                      if (division.province) {
                        let province = await ProvinceModel.findById(
                          division.province
                        );
                        if (province) {
                          await ProvinceModel.updateOne(
                            { _id: province._id },
                            { $inc: { activeHalqaCount: changeValue } }
                          );
                          if (province.country) {
                            let country = await CountryModel.findById(
                              province.country
                            );
                            if (country) {
                              await CountryModel.updateOne(
                                { _id: country._id },
                                { $inc: { activeHalqaCount: changeValue } }
                              );
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          return this.sendResponse(req, res, {
            message: "Halqa Updated",
            status: 200,
          });
        } catch (error) {
          console.log(error);
          return this.sendResponse(req, res, {
            message: "Wait! Too many requests",
            status: 400,
          });
        }
        // Step 3: Track the change direction (add or subtract)
      } else {
        return this.sendResponse(req, res, {
          message: "Somehow halqa was not updated",
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
}
const addHalqaToParentHierarchy = async (halqaId, parentId, parentType) => {
  try {
    let parent, grandParent, greatGrandParent;

    if (parentType === "Ilaqa") {
      // Update Ilaqa
      parent = await IlaqaModel.findById(parentId);
      if (!parent) {
        throw new Error(`Ilaqa with ID ${parentId} not found.`);
      } else {
        await IlaqaModel.updateOne(
          { _id: parentId },
          {
            $push: { childHalqaIDs: halqaId },
            $inc: { activeHalqaCount: 1 },
          }
        );

        // Update Maqam
        if (parent.maqam) {
          grandParent = await MaqamModel.findById(parent.maqam);
          if (grandParent) {
            await MaqamModel.updateOne(
              { _id: grandParent._id },
              {
                $push: { childHalqaIDs: halqaId },
                $inc: { activeHalqaCount: 1 },
              }
            );

            // Update Province
            if (grandParent.province) {
              greatGrandParent = await ProvinceModel.findById(
                grandParent.province
              );
              if (greatGrandParent) {
                await ProvinceModel.updateOne(
                  { _id: greatGrandParent._id },
                  {
                    $push: { childHalqaIDs: halqaId },
                    $inc: { activeHalqaCount: 1 },
                  }
                );

                // Update Country
                if (greatGrandParent.country) {
                  await CountryModel.updateOne(
                    { _id: greatGrandParent.country },
                    {
                      $push: { childHalqaIDs: halqaId },
                      $inc: { activeHalqaCount: 1 },
                    }
                  );
                }
              }
            }
          }
        }
      }
    } else if (parentType === "Maqam") {
      // Update Maqam

      parent = await MaqamModel.findById(parentId);
      if (!parent) {
        throw new Error(`Maqam with ID ${parentId} not found.`);
      } else {
        await MaqamModel.updateOne(
          { _id: parentId },
          {
            $push: { childHalqaIDs: halqaId },
            $inc: { activeHalqaCount: 1 },
          }
        );

        // Update Province
        if (parent.province) {
          grandParent = await ProvinceModel.findById(parent.province);
          if (grandParent) {
            await ProvinceModel.updateOne(
              { _id: grandParent._id },
              {
                $push: { childHalqaIDs: halqaId },
                $inc: { activeHalqaCount: 1 },
              }
            );

            // Update Country
            if (grandParent.country) {
              await CountryModel.updateOne(
                { _id: grandParent.country },
                {
                  $push: { childHalqaIDs: halqaId },
                  $inc: { activeHalqaCount: 1 },
                }
              );
            }
          }
        }
      }
    } else if (parentType === "Division") {
      // Update Division
      parent = await DivisionModel.findById(parentId);
      if (!parent) {
        throw new Error(`Division with ID ${parentId} not found.`);
      } else {
        await DivisionModel.updateOne(
          { _id: parentId },
          {
            $push: { childHalqaIDs: halqaId },
            $inc: { activeHalqaCount: 1 },
          }
        );

        // Update Province
        if (parent.province) {
          grandParent = await ProvinceModel.findById(parent.province);
          if (grandParent) {
            await ProvinceModel.updateOne(
              { _id: grandParent._id },
              {
                $push: { childHalqaIDs: halqaId },
                $inc: { activeHalqaCount: 1 },
              }
            );

            // Update Country
            if (grandParent.country) {
              await CountryModel.updateOne(
                { _id: grandParent.country },
                {
                  $push: { childHalqaIDs: halqaId },
                  $inc: { activeHalqaCount: 1 },
                }
              );
            }
          }
        }
      }
    } else if (parentType === "Tehsil") {
      // Update Tehsil
      parent = await TehsilModel.findById(parentId);
      if (!parent) {
        throw new Error(`Tehsil with ID ${parentId} not found.`);
      } else {
        await TehsilModel.updateOne(
          { _id: parentId },
          {
            $push: { childHalqaIDs: halqaId },
            $inc: { activeHalqaCount: 1 },
          }
        );
        if (parent.district) {
          grandParent = await DistrictModel.findById(parent.district);
          // Update Division
          if (grandParent.division) {
            greatGrandParent = await DivisionModel.findById(
              grandParent.division
            );
            if (greatGrandParent) {
              await DivisionModel.updateOne(
                { _id: greatGrandParent._id },
                {
                  $push: { childHalqaIDs: halqaId },
                  $inc: { activeHalqaCount: 1 },
                }
              );

              // Update Province and Country
              if (greatGrandParent.province) {
                let province = await ProvinceModel.findById(
                  greatGrandParent.province
                );
                if (province) {
                  await ProvinceModel.updateOne(
                    { _id: province._id },
                    {
                      $push: { childHalqaIDs: halqaId },
                      $inc: { activeHalqaCount: 1 },
                    }
                  );
                  if (province.country) {
                    await CountryModel.updateOne(
                      { _id: province.country },
                      {
                        $push: { childHalqaIDs: halqaId },
                        $inc: { activeHalqaCount: 1 },
                      }
                    );
                  }
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error updating parent hierarchy:", error);
  }
};

module.exports = Halqa;
