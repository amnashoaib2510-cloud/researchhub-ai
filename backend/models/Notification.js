const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "PROJECT_INVITATION",
        "TASK_ASSIGNED",
        "DEADLINE_REMINDER",
        "RESEARCH_UPDATE",
        "PAPER_UPLOADED",
        "GENERAL",
      ],
      default: "GENERAL",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
