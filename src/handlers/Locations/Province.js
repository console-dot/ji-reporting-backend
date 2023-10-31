const { ProvinceModel } = require('../../model');
const Response = require('../Response');

class Province extends Response {
  createOne = async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return this.sendResponse(req, res, {
          message: 'Name is required!',
          status: 400,
        });
      }
      const isExist = await ProvinceModel.findOne({ name });
      if (isExist) {
        return this.sendResponse(req, res, {
          message: 'Province already exist!',
          status: 400,
        });
      }
      const newProvince = new ProvinceModel({ name });
      await newProvince.save();
      return this.sendResponse(req, res, {
        message: 'Province created',
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
      const data = await ProvinceModel.find({});
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
      const data = await ProvinceModel.findOne({ _id });
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
      const isExist = await ProvinceModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: 'Not found!',
          status: 404,
        });
      }
      const updatedData = await ProvinceModel.updateOne(
        { _id },
        { $set: data }
      );
      if (updatedData?.modifiedCount > 0) {
        return this.sendResponse(req, res, {
          message: 'Province updated',
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
      const isExist = await ProvinceModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: 'Not found!',
          status: 404,
        });
      }
      const deleted = await ProvinceModel.deleteOne({ _id });
      if (deleted?.deletedCount > 0) {
        return this.sendResponse(req, res, {
          message: 'Province deleted',
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

module.exports = Province;
