const { auditLogger } = require("../../middlewares/auditLogger");
const { HalqaModel, UserModel } = require("../../model");
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
        name: { $regex: new RegExp(`^${name}$`, 'i') }, // Case-insensitive check for name
        parentId,
        parentType
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
        parentType: parentType,
        unitType,
      });
      await auditLogger(
        userExist,
        "CREATED_HALQA",
        "A user Created Halqa",
        req
      );
      await newHalqa.save();
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
  toggleDisable = async (req, res) => {
    try {
      const _id = req.params.id;
      const { disabled } = req.body;
      const isExist = await HalqaModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      const updatedLocation = await HalqaModel.updateOne(
        { _id },
        {
          $set: { disabled },
        }
      );
      if (updatedLocation?.modifiedCount > 0) {
        return this.sendResponse(req, res, {
          message: "Halqa Updated",
          status: 200,
        });
      }
      return this.sendResponse(req, res, {
        message: "Wait! Too many requests",
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

module.exports = Halqa;
