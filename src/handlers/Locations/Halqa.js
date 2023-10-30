const { HalqaModel } = require('../../model');
const Response = require('../Response');

class Halqa extends Response {
  createOne = async (req, res) => {
    try {
      const { name, parentId, type } = req.body;
      if (!name) {
        return this.sendResponse(req, res, {
          message: 'Name is required!',
          status: 400,
        });
      }
      if (!parentId) {
        return this.sendResponse(req, res, {
          message:
            type === 'maqam' ? 'Tehsil is required!' : 'Tehsil is required!',
          status: 400,
        });
      }
      const isExist = await HalqaModel.findOne({
        name,
        parentId,
        parentType: type,
      });
      if (isExist) {
        return this.sendResponse(req, res, {
          message: 'Halqa already exist!',
          status: 400,
        });
      }
      const newHalqa = new HalqaModel({ name, parentId, parentType: type });
      await newHalqa.save();
      return this.sendResponse(req, res, {
        message: 'Halqa created',
        status: 201,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: 'Internal Server Error',
        status: 500,
      });
    }
  };
  getAll = async (req, res) => {
    try {
      const data = await HalqaModel.find({});
      return this.sendResponse(req, res, { data, status: 200 });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: 'Internal Server Error',
        status: 500,
      });
    }
  };
  getOne = async (req, res) => {
    try {
      const _id = req.params.id;
      const data = await HalqaModel.findOne({ _id });
      if (!data) {
        return this.sendResponse(req, res, {
          message: 'Not found!',
          status: 404,
        });
      }
      return this.sendResponse(req, res, { data, status: 200 });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: 'Internal Server Error',
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
          message: 'Not found!',
          status: 404,
        });
      }
      const updatedData = await HalqaModel.updateOne({ _id }, { $set: data });
      if (updatedData?.modifiedCount > 0) {
        return this.sendResponse(req, res, {
          message: 'Halqa updated',
          status: 200,
        });
      }
      return this.sendResponse(req, res, {
        message: 'Nothing to update',
        status: 400,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: 'Internal Server Error',
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
          message: 'Not found!',
          status: 404,
        });
      }
      const deleted = await HalqaModel.deleteOne({ _id });
      if (deleted?.deletedCount > 0) {
        return this.sendResponse(req, res, {
          message: 'Halqa deleted',
          status: 200,
        });
      }
      return this.sendResponse(req, res, {
        message: 'Can not delete',
        status: 400,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: 'Internal Server Error',
        status: 500,
      });
    }
  };
}

module.exports = Halqa;
