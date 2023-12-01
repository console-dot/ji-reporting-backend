const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Response = require("../Response");
const {
  UserModel,
  DistrictModel,
  TehsilModel,
  HalqaModel,
  MaqamModel,
} = require("../../model");

class FilterHalqas extends Response {
  getHalqas = async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 401,
        });
      }

      const decoded = jwt.decode(token.split(" ")[1]);
      const userId = decoded?.id;

      if (!userId) {
        return this.sendResponse(req, res, {
          message: "User ID is required",
          status: 400,
        });
      }

      const userExist = await UserModel.findOne({ _id: userId });
      if (!userExist) {
        return this.sendResponse(req, res, {
          message: "User not found!",
          status: 404,
        });
      }

      const { userAreaId, userAreaType } = userExist;

      if (userAreaType == "Maqam") {
        const maqam = await MaqamModel.findOne({ _id: userAreaId });
        const halqas = await HalqaModel.find({ parentId: maqam._id });
        return this.sendResponse(req, res, { data: halqas, status: 200 });
      } else if (userAreaType == "Division") {
        const districts = await DistrictModel.find({ division: userAreaId });

        const tehsilPromises = districts.map(async (district) => {
          return await TehsilModel.find({ district: district._id });
        });

        const tehsils = await Promise.all(tehsilPromises);
        const allTehsils = [].concat(...tehsils);
        const halqaPromises = allTehsils.map(async (tehsil) => {
          return await HalqaModel.find({
            parentId: tehsil._id,
          });
        });
        const halqas = await Promise.all(halqaPromises);
        console.log(allTehsils);
        return this.sendResponse(req, res, { data: halqas, status: 200 });
      }
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
}
module.exports = FilterHalqas;
