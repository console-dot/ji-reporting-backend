const { UserModel } = require('../model');
const { UserRequest } = require('../model/UserRequest');
const Response = require('./Response');
const bcrypt = require('bcrypt');

class User extends Response {
  signup = async (req, res) => {
    try {
      const { email, password1, password2, name, age, nazim, areaId } =
        req.body;
      if (!email) {
        return this.sendResponse(req, res, {
          message: 'Email is requied!',
          status: 400,
        });
      }
      if (!password1) {
        return this.sendResponse(req, res, {
          message: 'Password is requied!',
          status: 400,
        });
      }
      if (!password2) {
        return this.sendResponse(req, res, {
          message: 'Confirm Password is requied!',
          status: 400,
        });
      }
      if (!name) {
        return this.sendResponse(req, res, {
          message: 'Name is requied!',
          status: 400,
        });
      }
      if (!age) {
        return this.sendResponse(req, res, {
          message: 'Age is requied!',
          status: 400,
        });
      }
      if (!nazim) {
        return this.sendResponse(req, res, {
          message: 'Nazim type is requied!',
          status: 400,
        });
      }
      if (!areaId) {
        return this.sendResponse(req, res, {
          message: 'Area is required is requied!',
          status: 400,
        });
      }
      if (password1 !== password2) {
        return this.sendResponse(req, res, {
          message: 'Both passwords should match!',
          status: 400,
        });
      }
      if (password1.lenght < 8) {
        return this.sendResponse(req, res, {
          message: 'Password must be minimum 8 character long',
          status: 400,
        });
      }
      const password = await bcrypt.hash(password1, 10);
      const emailExist = await UserModel.findOne({ email });
      if (emailExist) {
        return this.sendResponse(req, res, {
          message: 'Email already exist for another user',
          status: 400,
        });
      }
      const { halqa, tehsil, district, division, province } =
        extractArea(areaId);
      const role = getNazimRoles(nazim, {
        halqa,
        tehsil,
        district,
        division,
        province,
      });
      let UserRequestReq;
      if (nazim !== 'province') {
        const newUserRequest = new UserRequest({
          immediate_user_id: getImmediateUser(role, {
            halqa,
            tehsil,
            district,
            division,
            province,
          }),
        });
        UserRequestReq = await newUserRequest.save();
      }
      const newUser = new UserModel({
        email,
        password,
        name,
        age,
        role,
        nazim,
        halqa,
        tehsil,
        district,
        division,
        province,
        userRequest: UserRequestReq?.id,
      });
      const newUserReq = await newUser.save();
      if (!newUserReq?._id) {
        return this.sendResponse(req, res, {
          message: 'Failed to create new user',
          status: 400,
        });
      }
      return this.sendResponse(req, res, {
        message: 'User request sent for approval',
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
}
