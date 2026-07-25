const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
    },
    category: {
      type: String,
      default: "General",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: {
          type: String,
          enum: ["Lead", "Collaborator", "Reviewer"],
          default: "Collaborator",
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["Planning", "Active", "Completed", "On Hold"],
      default: "Planning",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    deadline: {
      type: Date,
    },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
