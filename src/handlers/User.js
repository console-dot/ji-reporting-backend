const { UserModel, RoleModel, ResetPasswordModel } = require('../model');
const { UserRequest } = require('../model/UserRequest');
const { getImmediateUser } = require('../utils');
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
  forget = async (req, res) => {
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
}

module.exports = User;
