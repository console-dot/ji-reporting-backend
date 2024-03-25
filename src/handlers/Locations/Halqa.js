const { HalqaModel } = require("../../model");
const { getPopulateHalqasMethod } = require("../../utils");
const { getPopulateMethod } = require("../../utils");
const Response = require("../Response");

class Halqa extends Response {
  createOne = async (req, res) => {
    try {
      const { name, parentId, parentType } = req.body;
      if (!name) {
        return this.sendResponse(req, res, {
          message: "Name is required!",
          status: 400,
        });
      }
      if (!parentId) {
        return this.sendResponse(req, res, {
          message:
            parentType === "maqam"
              ? "Tehsil is required!"
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
  getAll = async (req, res) => {
    try {
      const halqaData = await HalqaModel.find();

      for (const halqa of halqaData) {
        let populateOptions = {};
        if (halqa.parentType === "Tehsil") {
          populateOptions = {
            path: "parentId",
            populate: {
              path: "district",
              populate: { path: "division", populate: { path: "province" } }, // Populating division within district
            },
          };
        } else if (halqa.parentType === "Maqam") {
          populateOptions = {
            path: "parentId",
            populate: { path: "province" }, // Populating province within maqam
          };
        }
        await halqa.populate(populateOptions);
      }

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
