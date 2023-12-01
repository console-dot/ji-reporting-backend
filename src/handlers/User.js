const { UserModel, RoleModel, ResetPasswordModel } = require('../model');
const { UserRequest } = require('../model/UserRequest');
const { getImmediateUser, getParentId } = require('../utils');
const Mailer = require('./Mailer');
const Response = require('./Response');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class User extends Response {
  signup = async (req, res) => {
    try {
      const {
        email,
        password1,
        password2,
        name,
        age,
        nazim,
        userAreaId,
        userAreaType,
      } = req.body;

      if (!userAreaId || !userAreaType) {
        return this.sendResponse(req, res, {
          message: 'Location is requied!',
          status: 400,
        });
      }
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
      if (nazim === 'province' || userAreaType === 'Province') {
        return this.sendResponse(req, res, {
          message: 'Province signup not allowed',
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
      const userAreaIdExist = await UserModel.findOne({ userAreaId });
      if (userAreaIdExist) {
        return this.sendResponse(req, res, {
          message: 'Area already occupied',
          status: 400,
        });
      }
      const role = await RoleModel.findOne({ title: nazim });
      const immediate_user_id = await getImmediateUser(
        userAreaId,
        userAreaType
      );
      const newUserRequest = new UserRequest({
        immediate_user_id,
      });
      const UserRequestReq = await newUserRequest.save();
      const newUser = new UserModel({
        email,
        password,
        name,
        age,
        role: role ? [role?._id] : [],
        nazim,
        userAreaId,
        userAreaType,
        userRequestId: UserRequestReq?.id,
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
  forgetPassword = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return this.sendResponse(req, res, {
          message: 'Email is required',
          status: 400,
        });
      }
      const employeeExist = await UserModel.findOne({ email });
      if (employeeExist) {
        await ResetPasswordModel.deleteMany({ email });
        const key = jwt.sign({ email }, process.env.JWT_SECRET, {
          expiresIn: 60 * 60,
        });
        const mailer = new Mailer();
        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Password Reset</title>
          </head>
          <body>
            <table align="center" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
                <tr>
                    <td align="center" bgcolor="#0078d4" style="padding: 40px 0;">
                        <h1 style="color: #fff;">Password Reset</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px 0;">
                        <p>Hello,</p>
                        <p>You have requested to reset your password. To complete the password reset process, please click the following link:</p>
                        <p><a href="${
                          process.env.BASE_URL || 'http://localhost:3000'
                        }/reset-password?key=${key}" style="background-color: #0078d4; color: #fff; padding: 10px 20px; text-decoration: none;">Reset Password</a></p>
                        <p>If you did not request a password reset, you can ignore this email.</p>
                        <p>Thank you,</p>
                        <p>JIR - ConsoleDot</p>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#0078d4" style="padding: 20px 0; color: #fff; text-align: center;">
                        &copy; 2023 ConsoleDot. All rights reserved.
                    </td>
                </tr>
            </table>
          </body>
          </html>`;
        mailer.sendMail(
          process.env.MAIL_EMAIL,
          email,
          'Reset password link',
          html
        );
        const newKey = new ResetPasswordModel({ email, key });
        await newKey.save();
      }
      return this.sendResponse(req, res, {
        message:
          'Reset link will be sent to your email address if found in our records',
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: 'Internal Server Error',
        status: 500,
      });
    }
  };
  resetPassword = async (req, res) => {
    try {
      const { key, password1, password2 } = req.body;
      if (!key) {
        return this.sendResponse(req, res, {
          message: 'Key is required',
          status: 400,
        });
      }
      if (!password1) {
        return this.sendResponse(req, res, {
          message: 'Password is required',
          status: 400,
        });
      }
      if (password1 !== password2) {
        return this.sendResponse(req, res, {
          message: 'Both passwords should match',
          status: 400,
        });
      }
      try {
        const decoded = jwt.verify(key, process.env.JWT_SECRET);
        const keyExist = await ResetPasswordModel.findOne({
          email: decoded?.email,
          key,
        });
        if (!keyExist) {
          return this.sendResponse(req, res, {
            message: 'Invalid key',
            status: 400,
          });
        }
        await ResetPasswordModel.deleteMany({ email: decoded?.email });
        const password = await bcrypt.hash(password1, 10);
        await UserModel.updateOne(
          { email: decoded?.email },
          { $set: { password } }
        );
        return this.sendResponse(req, res, {
          message: 'Password Updated',
          status: 200,
        });
      } catch (err) {
        return this.sendResponse(req, res, {
          message: err?.message ? 'Link Expired' : err?.message.toUpperCase(),
          status: 400,
        });
      }
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: 'Internal Server Error',
        status: 500,
      });
    }
  };
  delete = async (req, res) => {
    try {
      const token = req.headers.authorization;
      const _id = req.params.id;
      if (!token) {
        return this.sendResponse(req, res, {
          message: 'Access Denied',
          status: 401,
        });
      }
      if (!_id) {
        return this.sendResponse(req, res, {
          message: 'ID is required',
          status: 404,
        });
      }
      const decoded = jwt.decode(token.split(' ')[1]);
      const userId = decoded?.id;
      const userExist = await UserModel.findOne({ _id });
      if (!userExist) {
        return this.sendResponse(req, res, {
          message: 'User not found',
          status: 404,
        });
      }
      const parentId = await getParentId(userId.toString());
      if (parentId?.toString() !== userId.toString()) {
        return this.sendResponse(req, res, {
          message: 'Third-party deletion not allowed',
          status: 401,
        });
      }
      if (userExist?.isDeleted) {
        return this.sendResponse(req, res, {
          message: 'User already deleted',
          status: 400,
        });
      }
      const update = await UserModel.updateOne(
        { _id },
        { $set: { isDeleted: true } }
      );
      if (update?.modifiedCount > 0) {
        return this.sendResponse(req, res, { message: 'User deleted' });
      }
      return this.sendResponse(req, res, { message: 'Nothing to delete' });
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
      const token = req.headers.authorization;
      if (!token) {
        return this.sendResponse(req, res, {
          message: 'Access Denied',
          status: 401,
        });
      }
      const decoded = jwt.decode(token.split(' ')[1]);
      const userId = decoded?.id;
      const _id = userId;
      if (!_id) {
        return this.sendResponse(req, res, {
          message: 'ID is required',
          status: 404,
        });
      }
      if (userId.toString() !== _id.toString()) {
        return this.sendResponse(req, res, {
          message: 'Third-party update not allowed',
          status: 404,
        });
      }
      const { name, email, age } = req.body;
      const userExist = await UserModel.findOne({ _id });
      if (!userExist) {
        return this.sendResponse(req, res, {
          message: 'User not found!',
          status: 404,
        });
      }
      if (!name) {
        return this.sendResponse(req, res, {
          message: 'Name is required',
          status: 400,
        });
      }
      if (!age) {
        return this.sendResponse(req, res, {
          message: 'Age is required',
          status: 400,
        });
      }
      if (!email) {
        return this.sendResponse(req, res, {
          message: 'Email is required',
          status: 400,
        });
      }
      const emailExist = await UserModel.findOne({ email, _id: { $ne: _id } });
      if (emailExist) {
        return this.sendResponse(req, res, {
          message: 'User already exist with same email',
          status: 400,
        });
      }
      const updated = await UserModel.updateOne(
        { _id },
        { $set: { name, email, age } }
      );
      if (updated?.modifiedCount > 0) {
        return this.sendResponse(req, res, { message: 'User updated.' });
      }
      return this.sendResponse(req, res, {
        message: 'Nothing to update!',
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
  updatePassword = async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return this.sendResponse(req, res, {
          message: 'Access Denied',
          status: 401,
        });
      }
      const decoded = jwt.decode(token.split(' ')[1]);
      const userId = decoded?.id;
      const _id = userId;
      if (!_id) {
        return this.sendResponse(req, res, {
          message: 'User ID is required',
          status: 400,
        });
      }
      const { password0, password1, password2 } = req.body;
      if (!password0) {
        return this.sendResponse(req, res, {
          message: 'Current Password is required',
          status: 400,
        });
      }
      if (!password1) {
        return this.sendResponse(req, res, {
          message: 'New Password is required',
          status: 400,
        });
      }
      if (password1 !== password2) {
        return this.sendResponse(req, res, {
          message: 'Both passwords should match',
          status: 400,
        });
      }
      const userExist = await UserModel.findOne({ _id });
      if (!userExist) {
        return this.sendResponse(req, res, {
          message: 'User not found!',
          status: 404,
        });
      }
      const isValid = await bcrypt.compare(password0, userExist?.password);
      if (!isValid) {
        return this.sendResponse(req, res, {
          message: 'Current password is not correct.',
          status: 405,
        });
      }
      const password = await bcrypt.hash(password1, 10);
      const updated = await UserModel.updateOne(
        { _id },
        { $set: { password } }
      );
      if (updated?.modifiedCount > 0) {
        return this.sendResponse(req, res, {
          message: 'Password updated',
        });
      }
      return this.sendResponse(req, res, {
        message: 'Password same as previous',
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
  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email) {
        return this.sendResponse(req, res, {
          message: 'Email is required!',
          status: 400,
        });
      }
      if (!password) {
        return this.sendResponse(req, res, {
          message: 'Password is required!',
          status: 400,
        });
      }
      const userExist = await UserModel.findOne({ email });
      if (!userExist) {
        return this.sendResponse(req, res, {
          message: 'Invalid username/password',
          status: 400,
        });
      }
      const isValid = await bcrypt.compare(password, userExist?.password);
      if (!isValid) {
        return this.sendResponse(req, res, {
          message: 'Invalid username/password',
          status: 400,
        });
      }
      if (userExist?.isDeleted) {
        return this.sendResponse(req, res, {
          message: 'User was deleted.',
          status: 400,
        });
      }
      const userRequest = await UserRequest.findOne({
        _id: userExist?.userRequestId,
      });
      if (userRequest?.status === 'pending') {
        return this.sendResponse(req, res, {
          message: 'Account not verified yet.',
          status: 400,
        });
      }
      if (userRequest?.status === 'rejected') {
        return this.sendResponse(req, res, {
          message: 'Account request declined.',
          status: 400,
        });
      }
      const token = jwt.sign(
        { email, id: userExist?._id },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        }
      );
      return this.sendResponse(req, res, {
        data: { token, email, id: userExist?._id, type: userExist?.nazim },
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: 'Internal Server Error',
        status: 500,
      });
    }
  };
  getAllRequests = async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return this.sendResponse(req, res, {
          message: 'Access Denied',
          status: 401,
        });
      }
      const decoded = jwt.decode(token.split(' ')[1]);
      const userId = decoded?.id;
      const { userAreaId: immediate_user_id } = await UserModel.findOne({
        _id: userId,
      });
      const allRequests = await UserRequest.find({
        immediate_user_id,
        status: 'pending',
      });
      const request_ids = allRequests.map((i) => i?._id.toString());
      const users = await UserModel.find(
        { userRequestId: request_ids },
        'name email userAreaId userAreaType'
      ).populate([{ path: 'userAreaId', refPath: 'userAreaType' }]);
      return this.sendResponse(req, res, {
        data: users.map((item, index) => ({
          ...item?._doc,
          req_id: request_ids[index],
        })),
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: 'Internal Server Error',
        status: 500,
      });
    }
  };
  me = async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return this.sendResponse(req, res, {
          message: 'Authorization token required',
          status: 401,
        });
      }
      const t = token.split(' ')[1];
      const decoded = jwt.decode(t);
      if (decoded) {
        const { id } = decoded;
        const user = await UserModel.findOne(
          { _id: id },
          'email name age _id userAreaId'
        ).populate({ path: 'userAreaId', refPath: 'userAreaType' });
        return this.sendResponse(req, res, {
          data: user,
          status: 200,
        });
      }
      return this.sendResponse(req, res, {
        message: 'Internal Server Error',
        status: 500,
      });
    } catch {
      console.log(err);
      return this.sendResponse(req, res, {
        message: 'Internal Server Error',
        status: 500,
      });
    }
  };
  updateRequest = async (req, res) => {
    try {
      const _id = req.params?.id;
      const { status } = req.body;
      const token = req.headers.authorization;
      if (!token) {
        return this.sendResponse(req, res, {
          message: 'Access Denied',
          status: 401,
        });
      }
      if (!_id) {
        return this.sendResponse(req, res, {
          message: 'ID is required',
          status: 400,
        });
      }
      if (!status) {
        return this.sendResponse(req, res, {
          message: 'Status is required',
          status: 400,
        });
      }
      const decoded = jwt.decode(token.split(' ')[1]);
      const userId = decoded?.id;
      const { userAreaId: immediate_user_id } = await UserModel.findOne({
        _id: userId,
      });
      const requestExist = await UserRequest.findOne({ _id });
      if (!requestExist) {
        return this.sendResponse(req, res, {
          message: 'Request not found!',
          status: 404,
        });
      }
      const update = await UserRequest.updateOne(
        { _id, immediate_user_id },
        { $set: { status } }
      );
      if (update?.modifiedCount > 0) {
        return this.sendResponse(req, res, {
          message: 'Status Updated',
        });
      }
      return this.sendResponse(req, res, {
        message: 'Nothing to update!',
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

module.exports = User;
