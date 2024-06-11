const {
  UserModel,
  RoleModel,
  ResetPasswordModel,
  HalqaModel,
  MaqamModel,
  DivisionModel,
  CountryModel,
  IlaqaModel,
} = require("../model");
const { UserRequest } = require("../model/userRequest");
const {
  MaqamReportModel,
  HalqaReportModel,
  DivisionReportModel,
} = require("../model/reports");
const { getImmediateUser, getParentId, getRoleFlow } = require("../utils");
const Mailer = require("./Mailer");
const Response = require("./Response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auditLogger } = require("../middlewares/auditLogger");

class User extends Response {
  signup = async (req, res) => {
    try {
      let {
        email,
        password1,
        password2,
        name,
        age,
        nazim,
        userAreaId,
        userAreaType,
        fatherName,
        dob,
        address,
        qualification,
        subject,
        semester,
        institution,
        joiningDate,
        phoneNumber,
        whatsAppNumber,
        nazimType,
      } = req.body;
      if (!userAreaId || !userAreaType) {
        return this.sendResponse(req, res, {
          message: "Location is requied!",
          status: 400,
        });
      }
      if (!email) {
        return this.sendResponse(req, res, {
          message: "Email is requied!",
          status: 400,
        });
      } else {
        email = email.toLowerCase();
      }
      if (!password1) {
        return this.sendResponse(req, res, {
          message: "Password is requied!",
          status: 400,
        });
      }
      if (!password2) {
        return this.sendResponse(req, res, {
          message: "Confirm Password is requied!",
          status: 400,
        });
      }
      if (!name) {
        return this.sendResponse(req, res, {
          message: "Name is requied!",
          status: 400,
        });
      }
      if (!age) {
        return this.sendResponse(req, res, {
          message: "Age is requied!",
          status: 400,
        });
      }
      if (!nazim) {
        return this.sendResponse(req, res, {
          message: "Nazim type is requied!",
          status: 400,
        });
      }
      if (password1 !== password2) {
        return this.sendResponse(req, res, {
          message: "Both passwords should match!",
          status: 400,
        });
      }
      if (!fatherName) {
        return this.sendResponse(req, res, {
          message: "Father Name is requied!",
          status: 400,
        });
      }
      if (!dob) {
        return this.sendResponse(req, res, {
          message: "Date of Birth is requied!",
          status: 400,
        });
      }
      if (!address) {
        return this.sendResponse(req, res, {
          message: "Address is requied!",
          status: 400,
        });
      }
      if (!qualification) {
        return this.sendResponse(req, res, {
          message: "QFualification is requied!",
          status: 400,
        });
      }
      if (!subject) {
        return this.sendResponse(req, res, {
          message: "Subject is requied!",
          status: 400,
        });
      }
      if (!semester) {
        return this.sendResponse(req, res, {
          message: "Semester/Year is requied!",
          status: 400,
        });
      }
      if (!institution) {
        return this.sendResponse(req, res, {
          message: "Institution is requied!",
          status: 400,
        });
      }
      if (!joiningDate) {
        return this.sendResponse(req, res, {
          message: "Joining Date is requied!",
          status: 400,
        });
      }
      if (!phoneNumber) {
        return this.sendResponse(req, res, {
          message: "PhoneNumber is requied!",
          status: 400,
        });
      }
      if (!nazimType) {
        return this.sendResponse(req, res, {
          message: "Nazim Type is requied!",
          status: 400,
        });
      }
      if (password1.length < 8) {
        return this.sendResponse(req, res, {
          message: "Password must be minimum 8 character long",
          status: 400,
        });
      }
      const password = await bcrypt.hash(password1, 10);
      const emailExist = await UserModel.findOne({ email });
      if (emailExist) {
        return this.sendResponse(req, res, {
          message: "Email already exist for another user",
          status: 400,
        });
      }

      const role = await RoleModel.findOne({ title: nazim });
      const immediate_user_id = await getImmediateUser(
        userAreaId,
        userAreaType
      );
      const existingNazim = await UserModel.findOne({
        userAreaId: userAreaId,
        nazimType: { $in: ["nazim", "rukan-nazim", "umeedwaar-nazim"] },
        isDeleted: false,
      });
      if (
        existingNazim &&
        (nazimType === "nazim" ||
          nazimType === "rukan-nazim" ||
          nazimType === "umeedwaar-nazim")
      ) {
        return this.sendResponse(req, res, {
          message: `Another ${existingNazim?.nazimType} with ${existingNazim?.email} found for this area`,
          status: 404,
        });
      }
      let newUserRequest;
      if (
        (nazimType === "rukan" || nazimType === "umeedwar") &&
        userAreaType !== "Halqa" &&
        userAreaType !== "Ilaqa"
      ) {
        newUserRequest = new UserRequest({
          immediate_user_id: userAreaId,
          nazimType,
        });
      } else {
        newUserRequest = new UserRequest({
          immediate_user_id,
          nazimType,
        });
      }
      const userRequestReq = await newUserRequest.save();
      const newUser = new UserModel({
        email,
        password,
        name,
        age,
        role: role ? [role?._id] : [],
        nazim,
        userAreaId,
        userAreaType,
        userRequestId: userRequestReq?._id,
        fatherName,
        dob,
        address,
        qualification,
        subject,
        semester,
        institution,
        joiningDate,
        phoneNumber,
        whatsAppNumber,
        nazimType,
      });
      const newUserReq = await newUser.save();
      await auditLogger(newUserReq, "USER_SIGNUP", "New user signed up", req);
      if (!newUserReq?._id) {
        return this.sendResponse(req, res, {
          message: "Failed to create new user",
          status: 400,
        });
      }
      return this.sendResponse(req, res, {
        message: "User request sent for approval",
        status: 201,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  login = async (req, res) => {
    try {
      const { password } = req.body;
      let { email } = req.body;
      if (!email) {
        return this.sendResponse(req, res, {
          message: "Email is required!",
          status: 400,
        });
      } else {
        email = email.toLowerCase();
      }
      if (!password) {
        return this.sendResponse(req, res, {
          message: "Password is required!",
          status: 400,
        });
      }
      const userExist = await UserModel.findOne({ email });
      // return
      if (!userExist) {
        return this.sendResponse(req, res, {
          message: "User does not exist",
          status: 400,
        });
      }
      const isValid = await bcrypt.compare(password, userExist?.password);
      if (!isValid) {
        return this.sendResponse(req, res, {
          message: "Invalid password",
          status: 400,
        });
      }
      if (userExist?.isDeleted) {
        return this.sendResponse(req, res, {
          message: "Your access is revoked by the Admin.",
          status: 400,
        });
      }
      if (userExist.nazim.toLowerCase() === "halqa") {
        const areaExist = await HalqaModel?.findOne({
          _id: userExist?.userAreaId,
        });
        if (areaExist?.disabled == true) {
          return this.sendResponse(req, res, {
            message: "Your area exists no more.",
            status: 404,
          });
        }
      } else if (userExist.nazim.toLowerCase() === "maqam") {
        const areaExist = await MaqamModel?.findOne({
          _id: userExist?.userAreaId,
        });
        if (areaExist?.disabled == true) {
          return this.sendResponse(req, res, {
            message: "Your area exists no more.",
            status: 404,
          });
        }
      } else if (userExist.nazim.toLowerCase() === "ilaqa") {
        const areaExist = await IlaqaModel?.findOne({
          _id: userExist?.userAreaId,
        });
        if (areaExist?.disabled == true) {
          return this.sendResponse(req, res, {
            message: "Your area exists no more.",
            status: 404,
          });
        }
      } else if (userExist.nazim.toLowerCase() === "division") {
        const areaExist = await DivisionModel?.findOne({
          _id: userExist?.userAreaId,
        });

        if (areaExist?.disabled == true) {
          return this.sendResponse(req, res, {
            message: "Your area exists no more.",
            status: 404,
          });
        }
      } else if (userExist.nazim.toLowerCase() === "country") {
        const areaExist = await CountryModel?.findOne({
          _id: userExist?.userAreaId,
        });

        if (areaExist?.disabled == true) {
          return this.sendResponse(req, res, {
            message: "Your area exists no more.",
            status: 404,
          });
        }
      }

      const userRequest = await UserRequest.findOne({
        _id: userExist?.userRequestId,
      });
      if (userRequest?.status === "pending") {
        return this.sendResponse(req, res, {
          message: "Account not verified yet.",
          status: 400,
        });
      }
      if (userRequest?.status === "rejected") {
        return this.sendResponse(req, res, {
          message: "Account request declined.",
          status: 400,
        });
      }
      const token = jwt.sign(
        { email, id: userExist?._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      const user = {
        _id: userExist?._id,
        email: req?.body?.email,
      };
      await auditLogger(user, "USER_LOGGED_IN", "A user logged in", req);
      return this.sendResponse(req, res, {
        data: {
          token,
          email,
          id: userExist?._id,
          type: userExist?.nazim,
          nazimType: userExist?.nazimType,
        },
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  forgetPassword = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return this.sendResponse(req, res, {
          message: "Email is required",
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
                          process.env.BASE_URL || "http://localhost:3000"
                        }/reset?key=${key}" style="background-color: #0078d4; color: #fff; padding: 10px 20px; text-decoration: none;">Reset Password</a></p>
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
          "Reset password link",
          html
        );
        const newKey = new ResetPasswordModel({ email, key });
        await newKey.save();
        await auditLogger(
          employeeExist,
          "PASSWORD_RESET_REQUEST",
          "A user tried to for reset link",
          req
        );
      }
      return this.sendResponse(req, res, {
        message:
          "Reset link will be sent to your email address if found in our records",
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  resetPassword = async (req, res) => {
    try {
      const { key, password1, password2 } = req.body;
      if (!key) {
        return this.sendResponse(req, res, {
          message: "Key is required",
          status: 400,
        });
      }
      if (!password1) {
        return this.sendResponse(req, res, {
          message: "Password is required",
          status: 400,
        });
      }
      if (password1 !== password2) {
        return this.sendResponse(req, res, {
          message: "Both passwords should match",
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
            message: "Invalid key",
            status: 400,
          });
        }
        await ResetPasswordModel.deleteMany({ email: decoded?.email });
        const password = await bcrypt.hash(password1, 10);
        const user = await UserModel.updateOne(
          { email: decoded?.email },
          { $set: { password } }
        );
        await auditLogger(
          user,
          "PASSWORD_UPDATED",
          "A user reset his password",
          req
        );
        return this.sendResponse(req, res, {
          message: "Password Updated",
          data: { email: decoded?.email },
          status: 200,
        });
      } catch (err) {
        return this.sendResponse(req, res, {
          message: err?.message ? "Link Expired" : err?.message.toUpperCase(),
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
  delete = async (req, res) => {
    try {
      const token = req.headers.authorization;
      const _id = req.params.id;
      if (!token) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 401,
        });
      }
      if (!_id) {
        return this.sendResponse(req, res, {
          message: "ID is required",
          status: 404,
        });
      }
      const decoded = jwt.decode(token.split(" ")[1]);
      const user = await UserModel.findOne({ _id: decoded?.id });
      const userExist = await UserModel.findOne({ _id });
      if (!userExist) {
        return this.sendResponse(req, res, {
          message: "User not found",
          status: 404,
        });
      }
      if (userExist?.isDeleted) {
        return this.sendResponse(req, res, {
          message: "User already deleted",
          status: 400,
        });
      }
      const update = await UserModel.updateOne(
        { _id },
        { $set: { isDeleted: true } }
      );
      if (update?.modifiedCount > 0) {
        await auditLogger(
          user,
          "DEACTIVATE_USER",
          "A user tried to deactivate a user",
          req
        );
        return this.sendResponse(req, res, { message: "User deleted" });
      }
      return this.sendResponse(req, res, { message: "Nothing to delete" });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  update = async (req, res) => {
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
      const _id = userId;
      if (!_id) {
        return this.sendResponse(req, res, {
          message: "ID is required",
          status: 404,
        });
      }
      if (userId.toString() !== _id.toString()) {
        return this.sendResponse(req, res, {
          message: "Third-party update not allowed",
          status: 404,
        });
      }

      let {
        name,
        email,
        age,
        fatherName,
        dob,
        address,
        qualification,
        subject,
        semester,
        institution,
        joiningDate,
        phoneNumber,
        whatsAppNumber,
      } = req.body;
      const userExist = await UserModel.findOne({ _id });
      if (!userExist) {
        return this.sendResponse(req, res, {
          message: "User not found!",
          status: 404,
        });
      }
      if (!name) {
        return this.sendResponse(req, res, {
          message: "Name is required",
          status: 400,
        });
      }
      if (!age) {
        return this.sendResponse(req, res, {
          message: "Age is required",
          status: 400,
        });
      }
      if (!email) {
        return this.sendResponse(req, res, {
          message: "Email is required",
          status: 400,
        });
      } else {
        email = email.toLowerCase();
      }
      const emailExist = await UserModel.findOne({ email, _id: { $ne: _id } });
      if (emailExist) {
        return this.sendResponse(req, res, {
          message: "User already exist with same email",
          status: 400,
        });
      }
      const updated = await UserModel.updateOne(
        { _id },
        {
          $set: {
            name,
            email,
            age,
            fatherName,
            dob,
            address,
            qualification,
            subject,
            semester,
            institution,
            joiningDate,
            phoneNumber,
            whatsAppNumber,
          },
        }
      );
      if (updated?.modifiedCount > 0) {
        await auditLogger(
          userExist,
          "UPDATE_PROFILE",
          "A user tried to update his profile",
          req
        );
        return this.sendResponse(req, res, { message: "User updated." });
      }
      return this.sendResponse(req, res, {
        message: "Nothing to update!",
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
  updateStatus = async (req, res) => {
    try {
      const { userAreaId, nazimType, nazim, userId } = req?.body;
      const token = req?.headers.authorization;

      if (!token) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 401,
        });
      }

      const decoded = jwt.decode(token?.split(" ")[1]);
      const superId = decoded?.id;
      const _id = superId;

      if (!nazimType) {
        return this.sendResponse(req, res, {
          message: "NazimType  is required",
          status: 404,
        });
      }

      if (superId.toString() !== _id.toString()) {
        return this.sendResponse(req, res, {
          message: "Third-party update not allowed",
          status: 404,
        });
      }

      const userExist = await UserModel?.findOne({ _id });

      if (!userExist) {
        return this.sendResponse(req, res, {
          message: "Super User not found!",
          status: 404,
        });
      }

      const isUser = await UserModel.findOne({ _id: userId });

      if (!isUser) {
        return this.sendResponse(req, res, {
          message: "User not found to update",
          status: 404,
        });
      }

      const existingNazim = await UserModel.findOne({
        userAreaId: userAreaId,
        nazimType: { $in: ["nazim", "rukan-nazim", "umeedwaar-nazim"] },
        isDeleted: false,
      });
      if (
        existingNazim &&
        existingNazim._id.toString() !== userId.toString() &&
        (nazimType === "nazim" ||
          nazimType === "rukan-nazim" ||
          nazimType === "umeedwaar-nazim")
      ) {
        return this.sendResponse(req, res, {
          message: `Another ${existingNazim?.nazimType} with ${existingNazim?.email} found for this area`,
          status: 404,
        });
      }

      const role = await RoleModel.findOne({ title: nazim.toLowerCase() });
      const isUpdated = await UserModel.updateOne(
        { _id: userId },
        {
          $set: {
            userAreaType: nazim,
            nazim: nazim.toLowerCase(),
            userAreaId,
            joiningDate: { date: Date.now(), title: nazimType },
            nazimType,
            role: role ? [role?._id] : [],
            isDeleted: false,
          },
        }
      );

      if (isUpdated?.modifiedCount > 0) {
        await auditLogger(
          userExist,
          "UPDATE_STATUS",
          "A user tried to update status",
          req
        );
        return this.sendResponse(req, res, { message: "User updated." });
      }

      return this.sendResponse(req, res, {
        message: "Nothing to update!",
        status: 400,
      });
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };

  updatePassword = async (req, res) => {
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
      const _id = userId;
      const userExist = await UserModel.findOne({ _id });
      if (!userExist) {
        return this.sendResponse(req, res, {
          message: "User not found!",
          status: 404,
        });
      }
      if (!_id) {
        return this.sendResponse(req, res, {
          message: "User ID is required",
          status: 400,
        });
        }
        const { password0, password1, password2 } = req.body;
        if (!password0) {
          return this.sendResponse(req, res, {
            message: "Current Password is required",
            status: 400,
            });
            }
            if (!password1) {
              return this.sendResponse(req, res, {
                message: "New Password is required",
                status: 400,
                });
                }
                if (password1 !== password2) {
                  return this.sendResponse(req, res, {
                    message: "Both passwords should match",
                    status: 400,
                    });
                    }
                    const isValid = await bcrypt.compare(password0, userExist?.password);
                    if (!isValid) {
                      return this.sendResponse(req, res, {
                        message: "Current password is not correct.",
                        status: 405,
                        });
                        }
                        const password = await bcrypt.hash(password1, 10);
                        const updated = await UserModel.updateOne(
                          { _id },
                          { $set: { password } }
                          );
                          if (updated?.modifiedCount > 0) {
        await auditLogger(
          userExist,
          "UPDATE_PASSWORD",
          "A user tried to update Password",
          req
        );
        return this.sendResponse(req, res, {
          message: "Password updated",
        });
      }
      return this.sendResponse(req, res, {
        message: "Password same as previous",
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
  getAllRequests = async (req, res) => {
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
      const userFound = await UserModel.findOne({
        _id: userId,
      });
      if (!userFound) {
        return this.sendResponse(req, res, {
          message: "User not found",
          status: 404,
        });
      }
      const allRequests = await UserRequest.find({
        immediate_user_id: userFound?.userAreaId,
        status: "pending",
      });
      const request_ids = allRequests.map((i) => i?._id.toString());
      const users = await UserModel.find(
        { userRequestId: request_ids },
        "name email userAreaId userAreaType nazimType"
      ).populate([{ path: "userAreaId", refPath: "userAreaType" }]);
      return this.sendResponse(req, res, {
        data: users.map((item, index) => ({
          ...item?._doc,
          req_id: request_ids[index],
        })),
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  me = async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return this.sendResponse(req, res, {
          message: "Authorization token required",
          status: 401,
        });
      }
      const t = token.split(" ")[1];
      const decoded = jwt.decode(t);
      if (decoded) {
        const { id } = decoded;
        const user = await UserModel.findOne(
          { _id: id },
          "email name age _id userAreaId fatherName phoneNumber whatsAppNumber joiningDate institution semester subject qualification address dob nazimType nazim isDeleted"
        ).populate({ path: "userAreaId", refPath: "userAreaType" });
        return this.sendResponse(req, res, {
          data: user,
          status: 200,
        });
      }
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
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
          message: "Access Denied",
          status: 401,
        });
      }
      if (!_id) {
        return this.sendResponse(req, res, {
          message: "ID is required",
          status: 400,
        });
      }
      if (!status) {
        return this.sendResponse(req, res, {
          message: "Status is required",
          status: 400,
        });
      }
      const decoded = jwt.decode(token.split(" ")[1]);
      const userId = decoded?.id;
      const { userAreaId: immediate_user_id, userAreaType } =
        await UserModel.findOne({
          _id: userId,
        });
      const allIds = await getRoleFlow(
        immediate_user_id.toString(),
        userAreaType.toLowerCase()
      );
      const requestExist = await UserRequest.findOne({ _id });
      if (!requestExist) {
        return this.sendResponse(req, res, {
          message: "Request not found!",
          status: 404,
        });
      }
      const update = await UserRequest.updateOne(
        { _id, immediate_user_id: allIds.map((i) => i?.toString()) },
        { $set: { status } }
      );
      if (update?.modifiedCount > 0) {
        await auditLogger(
          userExist,
          "UPDATE_REQUEST",
          "A user tried to update Request",
          req
        );
        return this.sendResponse(req, res, {
          message: "Status Updated",
        });
      }
      return this.sendResponse(req, res, {
        message: "Nothing to update!",
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
  getAllNazim = async (req, res) => {
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
      const { userAreaId: immediate_user_id, userAreaType: key } =
        await UserModel.findOne({
          _id: userId,
        });
      const validIds = (await getRoleFlow(immediate_user_id, key)).map((i) =>
        i?.toString()
      );
      const data = await UserModel.find(
        { userAreaId: validIds },
        "email name age _id userAreaId fatherName phoneNumber whatsAppNumber joiningDate institution semester subject qualification address dob nazimType isDeleted"
      ).populate([
        "userRequestId",
        { path: "userAreaId", refPath: "userAreaType" },
      ]);
      return this.sendResponse(req, res, {
        data: data.filter((i) => i?.userRequestId?.status === "accepted"),
        status: 200,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };

  getUnfilledUsers = async (req, res) => {
    try {
      // Code Here
      const token = req.headers.authorization;
      const { type } = req.query;
      if (!token) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 401,
        });
      }
      const _id = req.params.id;
      if (!_id) {
        return this.sendResponse(req, res, {
          message: "Invalid Token",
          status: 400,
        });
      }
      const models = {
        maqam: MaqamReportModel,
        division: DivisionReportModel,
      };
      const data = await models[type].findOne({ _id });
      if (!data) {
        return this.sendResponse(req, res, {
          message: "No report found!",
          status: 404,
        });
      }

      const areaId = data[`${type}AreaId`].toString();
      let halqas = [];
      let totalUsers = [];
      let filled = [];
      switch (type) {
        case "maqam":
          halqas = (await HalqaModel.find({ parentId: areaId })).map((i) =>
            i?._id?.toString()
          );
          totalUsers = (
            await UserModel.find({
              userAreaId: halqas,
            })
          ).map((i) => i?._id?.toString());
          filled = (
            await HalqaReportModel.find({
              userId: totalUsers,
              month: data.month,
            })
          ).map((i) => i?.userId?.toString());
          break;

        case "division":
          const temp = await HalqaModel.find({ parentType: "Tehsil" }).populate(
            {
              path: "parentId",
              populate: { path: "district", populate: { path: "division" } },
            }
          );
          halqas = temp
            .filter((i) => i?.parentId?.district?.division?._id === areaId)
            .map((i) => i?._id?.toString());
          totalUsers = (
            await UserModel.find({
              userAreaId: maqams,
            })
          ).map((i) => i?._id?.toString());
          filled = (
            await HalqaReportModel.find({
              userId: totalUsers,
              month: data.month,
            })
          ).map((i) => i?.userId?.toString());
          break;
        default:
          return this.sendResponse(req, res, {
            message: "Invalid area type",
            status: 400,
          });
      }

      const result = await UserModel.find({
        _id: totalUsers.filter((i) => !filled.includes(i)),
      });

      return this.sendResponse(req, res, {
        data: { result, total: totalUsers.length },
        status: 200,
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
  userSearchFilter = async (req, res) => {
    try {
      const {
        name,
        nazim,
        userAreaId,
        userAreaType,
        dob,
        address,
        qualification,
        subject,
        semester,
        institution,
        joiningDate,
        nazimType,
      } = req.query;
      const token = req.headers.authorization;
      if (!token) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 401,
        });
      }
      const decoded = jwt.decode(token.split(" ")[1]);
      if (!decoded) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 401,
        });
      }
      const userId = decoded?.id;
      const user = await UserModel.findOne({ _id: userId });
      const { userAreaId: id, nazim: key } = user;
      const accessList = (await getRoleFlow(id, key)).map((i) => i.toString());
      let searchResult;
      if (userAreaId && nazimType) {
        const areaQuery = {
          userAreaId: userAreaId,
          nazimType: nazimType,
        };
        searchResult = await UserModel.find(areaQuery).populate("userAreaId");
      } else {
        // Construct the query
        const query = {};
        // Add parameters to the query if they are provided
        if (name) query.name = { $regex: new RegExp(name, "i") };
        if (nazim) query.nazim = { $regex: new RegExp(nazim, "i") };
        if (userAreaType)
          query.userAreaType = { $regex: new RegExp(userAreaType, "i") };
        if (dob) query.dob = dob;
        if (address) query.address = { $regex: new RegExp(address, "i") };
        if (qualification) query.qualification = qualification;
        if (subject) {
          var ObjectId = require("mongoose").Types.ObjectId;
          query.subject = new ObjectId(subject);
        }
        if (semester) query.semester = semester;
        if (institution)
          query.institution = { $regex: new RegExp(institution, "i") };
        if (joiningDate) {
          const joiningYear = new Date(joiningDate).getFullYear();
          query.joiningDate = {
            $gte: new Date(`${joiningYear}-01-01`),
            $lt: new Date(`${joiningYear + 1}-01-01`),
          };
        }
        // Perform the search using the constructed query
        searchResult = await UserModel.find({
          ...query,
          userAreaId: accessList,
        }).populate("userAreaId");
      }
      // Send the search result as a response
      return this.sendResponse(req, res, {
        message: "User search successful",
        status: 200,
        data: searchResult,
      });
    } catch (error) {
      // Handle errors
      console.error(error);
      return this.sendResponse(req, res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };
}

module.exports = User;
