const { AuditLogModel } = require("../model");
const auditLogger = async (user, action, comments = "", req) => {
  const log = new AuditLogModel({
    userId: user._id,
    userEmail: user.email,
    timestamp: new Date(),
    httpMethod: req.method,
    url: req.originalUrl,
    comments,
  });

  try {
    await log.save();
  } catch (err) {
    console.error("Failed to save audit log:", err);
  }
};
module.exports = { auditLogger };
