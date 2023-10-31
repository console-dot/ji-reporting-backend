const { DistrictModel } = require('../../model');
const Response = require('../Response');

class District extends Response {
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
      const isExist = await DistrictModel.findOne({ name, division });
      if (isExist) {
        return this.sendResponse(req, res, {
          message: 'District already exist!',
          status: 400,
        });
      }
      const newDistrict = new DistrictModel({ name, division });
      await newDistrict.save();
      return this.sendResponse(req, res, {
        message: 'District created',
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
      const data = await DistrictModel.find({}).populate({
        path: 'division',
        populate: { path: 'province' },
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
      const data = await DistrictModel.findOne({ _id }).populate({
        path: 'division',
        populate: { path: 'province' },
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
      const isExist = await DistrictModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: 'Not found!',
          status: 404,
        });
      }
      const updatedData = await DistrictModel.updateOne(
        { _id },
        { $set: data }
      );
      if (updatedData?.modifiedCount > 0) {
        return this.sendResponse(req, res, {
          message: 'District updated',
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
      const isExist = await DistrictModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: 'Not found!',
          status: 404,
        });
      }
      const deleted = await DistrictModel.deleteOne({ _id });
      if (deleted?.deletedCount > 0) {
        return this.sendResponse(req, res, {
          message: 'District deleted',
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

module.exports = District;
