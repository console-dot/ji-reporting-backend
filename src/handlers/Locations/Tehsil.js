const { TehsilModel } = require('../../model');
const Response = require('../Response');

class Tehsil extends Response {
  createOne = async (req, res) => {
    try {
      const { name, district } = req.body;
      if (!name) {
        return this.sendResponse(req, res, {
          message: 'Name is required!',
          status: 400,
        });
      }
      if (!district) {
        return this.sendResponse(req, res, {
          message: 'District is required!',
          status: 400,
        });
      }
      const isExist = await TehsilModel.findOne({ name, district });
      if (isExist) {
        return this.sendResponse(req, res, {
          message: 'Tehsil already exist!',
          status: 400,
        });
      }
      const newTehsil = new TehsilModel({ name, district });
      await newTehsil.save();
      return this.sendResponse(req, res, {
        message: 'Tehsil created',
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
      const data = await TehsilModel.find({}).populate({
        path: 'district',
        populate: { path: 'division', populate: { path: 'province' } },
      });
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
      const data = await TehsilModel.findOne({ _id }).populate({
        path: 'district',
        populate: { path: 'division', populate: { path: 'province' } },
      });
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
      const isExist = await TehsilModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: 'Not found!',
          status: 404,
        });
      }
      const updatedData = await TehsilModel.updateOne({ _id }, { $set: data });
      if (updatedData?.modifiedCount > 0) {
        return this.sendResponse(req, res, {
          message: 'Tehsil updated',
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
      const isExist = await TehsilModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: 'Not found!',
          status: 404,
        });
      }
      const deleted = await TehsilModel.deleteOne({ _id });
      if (deleted?.deletedCount > 0) {
        return this.sendResponse(req, res, {
          message: 'Tehsil deleted',
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

module.exports = Tehsil;
