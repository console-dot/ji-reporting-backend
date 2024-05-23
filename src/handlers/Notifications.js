const { NotificationsModal, UserModel } = require("../model");
const Response = require("./Response");
const jwt = require("jsonwebtoken");

class Notifications extends Response {
  sendNotification = async (req, res) => {
    try {
      const { content, created_for } = req.body;
      if (!content) {
        return this.sendResponse(req, res, {
          message: "Notification content is requied!",
          status: 400,
        });
      }
      if (!created_for) {
        return this.sendResponse(req, res, {
          message: "Notification recipient is requied!",
          status: 400,
        });
      }
      const token = req.headers.authorization;
      if (!token) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 401,
        });
      } else {
        const decoded = jwt.decode(token.split(" ")[1]);
        const userId = decoded?.id;
        const _id = userId;
        const isExist = await UserModel.findOne({ _id });
        if (!_id) {
          return this.sendResponse(req, res, {
            message: "Invalid token",
            status: 404,
          });
        }
        if (!isExist) {
          return this.sendResponse(req, res, {
            message: "Invalid token",
            status: 404,
          });
        }
        if (isExist?.userAreaType === "Halqa") {
          return this.sendResponse(req, res, {
            message: "Action not allowed",
            status: 400,
          });
        }
        const validRecipients = [
          "halqa",
          "maqam",
          "division",
          "province",
          "ilaqa",
        ];
        if (!validRecipients.includes(created_for)) {
          return res.status(400).json({ error: "Invalid recipient type" });
        }
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const startOfMonth = new Date(`${currentYear}-${currentMonth}-01`);
        const endOfMonth = new Date(
          currentYear,
          currentMonth,
          0,
          23,
          59,
          59,
          999
        ); // Last day of the month, end of the day

        // Find if a notification already exists for the current month
        const notificationExist = await NotificationsModal.findOne({
          created_for,
          parentId: _id,
          parentType: isExist.nazim,
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        });
        if (notificationExist) {
          return this.sendResponse(req, res, {
            message: "Already notified for current month!",
            status: 400,
          });
        }
        const notification = new NotificationsModal({
          content,
          created_for,
          parentId: _id,
          parentType: isExist.nazim,
        });
        await notification.save();
        return this.sendResponse(req, res, {
          message: "Notification sent successfully!",
          status: 200,
        });
      }
    } catch (error) {
      console.error(error);
      return this.sendResponse(req, res, {
        message: "Internal server error",
        status: 500,
      });
    }
  };
  getNotifications = async (req, res) => {
    try {
      const forWhome = req.query.type;
      const token = req.headers.authorization;
      if (!token) {
        return this.sendResponse(req, res, {
          message: "Access Denied",
          status: 401,
        });
      } else {
        const decoded = jwt.decode(token.split(" ")[1]);
        const userId = decoded?.id;
        const _id = userId;
        const isExist = await UserModel.findOne({ _id });
        if (!isExist) {
          return this.sendResponse(req, res, {
            message: "Invalid token",
            status: 404,
          });
        } else {
          const notification = await NotificationsModal.find({
            created_for: forWhome,
          });
          if (notification) {
            return this.sendResponse(req, res, {
              data: notification,
              status: 200,
            });
          } else {
            return this.sendResponse(req, res, {
              message: "No notifications found!",
              status: 404,
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "Internal server error",
        status: 500,
      });
    }
  };
}

module.exports = Notifications;
