const { ProvinceModel, CountryModel } = require("../../model");
const Response = require("../Response");

class Province extends Response {
  createOne = async (req, res) => {
    try {
      const { name, country } = req.body;
      if (!name) {
        return this.sendResponse(req, res, {
          message: "Name is required!",
          status: 400,
        });
      }

      const isExist = await ProvinceModel.findOne({ name });
      if (isExist) {
        return this.sendResponse(req, res, {
          message: "Province already exist!",
          status: 400,
        });
      }
      const isCountry = await CountryModel.findOne({ name: country });
      if (isCountry) {
        const newProvince = new ProvinceModel({ name, country: isCountry._id });
        await newProvince.save();
        return this.sendResponse(req, res, {
          message: "Province created",
          status: 201,
        });
      }
      return this.sendResponse(req, res, {
        message: "No Country exists with this name",
        status: 404,
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
      const data = await ProvinceModel.find({});
      return this.sendResponse(req, res, { data, status: 200 });
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
      const data = await ProvinceModel.findOne({ _id });
      if (!data) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
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
      const isCuntryExist = await CountryModel.findOne({ name: data?.country });
      data["country"] = isCuntryExist._id;
      const isExist = await ProvinceModel.findOne({ _id });
      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }
      if (isCuntryExist) {
        const updatedData = await ProvinceModel.updateOne(
          { _id },
          { $set: data }
        );
        if (updatedData?.modifiedCount > 0) {
          return this.sendResponse(req, res, {
            message: "Province updated",
            status: 200,
          });
        }
        return this.sendResponse(req, res, {
          message: "Nothing to update",
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
  deleteOne = async (req, res) => {
    try {
      const _id = req.params.id;
      const isExist = await ProvinceModel.findOne({ _id });

      if (!isExist) {
        return this.sendResponse(req, res, {
          message: "Not found!",
          status: 404,
        });
      }

      const updated = await ProvinceModel.updateOne(
        { _id: _id },
        { $set: { disabled: !isExist.disabled } }
      );

      if (updated.modifiedCount > 0) {
        return this.sendResponse(req, res, {
          message: "Province status updated",
          status: 200,
        });
      }

      return this.sendResponse(req, res, {
        message: "Can not update",
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

module.exports = Province;
