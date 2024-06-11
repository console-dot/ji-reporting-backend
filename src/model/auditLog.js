const mongoose = require("mongoose");

const auditLogSchema = mongoose.Schema({
  userEmail: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  httpMethod: { type: String, required: true },
  url: { type: String, required: true },
  comments: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const AuditLogModel = mongoose.model("AuditLog", auditLogSchema);

module.exports = { AuditLogModel };
