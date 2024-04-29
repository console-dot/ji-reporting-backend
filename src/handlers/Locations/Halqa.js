const { HalqaModel } = require("../../model");
const { getPopulateMethod } = require("../../utils");
const Response = require("../Response");

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
        name,
        parentId,
        parentType: parentType,
      });
      if (isExist) {
        return this.sendResponse(req, res, {
          message: "Halqa already exist!",
          status: 400,
        });
      }
      const newHalqa = new HalqaModel({
        name,
        parentId,
        parentType: parentType,
        unitType,
      });
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
    try {
      const halqaData = await HalqaModel.find().lean();
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

      // Define batch size for parallel processing
      const batchSize = 500;

      // Populate halqas in parallel in batches
      await Promise.all(
        this.chunkArray(halqaData, batchSize).map((batch) =>
          this.populateHalqas(batch, populateOptions)
        )
      );
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
      const method = getPopulateMethod(halqaData?.parentType);
      let data = halqaData;
      if (method) {
        data = await halqaData.populate({
          path: "parentId",
          populate: method,
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
      const isExist = await HalqaModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
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
      const isExist = await HalqaModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      const deleted = await HalqaModel.deleteOne({ _id });
      if (deleted?.deletedCount > 0) {
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

module.exports = Halqa;
