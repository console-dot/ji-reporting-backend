const { RoleModel } = require('../model');
const Response = require('./Response');

class Role extends Response {
  getAll = async (req, res) => {
    try {
      const data = await RoleModel.find({});
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
      const title = req.params.title;
      const data = await RoleModel.findOne({ title });
      if (!data) {
        return this.sendResponse(req, res, {
          message: 'Role not found!',
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
  update = async (req, res) => {
    try {
      const title = req.params.title;
      const { access } = req.body;
      if (!access) {
        return this.sendResponse(req, res, {
          message: 'Access list is required',
          status: 400,
        });
      }
      const updated = await RoleModel.updateOne(
        { title },
        { $set: { access } }
      );
      if (updated?.modifiedCount > 0) {
        return this.sendResponse(req, res, {
          message: "Access list updated",
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
}

module.exports = Role;
