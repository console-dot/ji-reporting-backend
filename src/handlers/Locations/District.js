const { MaqamModel } = require('../../model');
const Response = require('../Response');

class Maqam extends Response {
  createOne = async (req, res) => {
    try {
      const { name, division } = req.body;
      if (!name) {
        return this.sendResponse(req, res, {
          message: 'Name is required!',
          status: 400,
        });
      }
      if (!division) {
        return this.sendResponse(req, res, {
          message: 'Division is required!',
          status: 400,
        });
      }
      const isExist = await MaqamModel.findOne({ name, division });
      if (isExist) {
        return this.sendResponse(req, res, {
          message: 'Maqam already exist!',
          status: 400,
        });
      }
      const newMaqam = new MaqamModel({ name, division });
      await newMaqam.save();
      return this.sendResponse(req, res, {
        message: 'Maqam created',
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
      const data = await MaqamModel.find({});
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
      const data = await MaqamModel.findOne({ _id });
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
      const isExist = await MaqamModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: 'Not found!',
          status: 404,
        });
      }
      const updatedData = await MaqamModel.updateOne({ _id }, { $set: data });
      if (updatedData?.modifiedCount > 0) {
        return this.sendResponse(req, res, {
          message: 'Maqam updated',
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
      const isExist = await MaqamModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: 'Not found!',
          status: 404,
        });
      }
      const deleted = await MaqamModel.deleteOne({ _id });
      if (deleted?.deletedCount > 0) {
        return this.sendResponse(req, res, {
          message: 'Maqam deleted',
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

module.exports = Maqam;
