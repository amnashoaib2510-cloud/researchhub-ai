const mongoose = require("mongoose");

const paperVersionSchema = new mongoose.Schema(
  {
    versionNumber: { type: Number, required: true },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notes: { type: String, default: "" },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const paperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Paper title is required"],
      trim: true,
    },
    authors: [{ type: String }],
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      default: "Uncategorized",
    },
    abstract: {
      type: String,
      default: "",
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    keywords: [{ type: String }],
    aiSummary: {
      type: String,
      default: "",
    },
    citationCount: {
      type: Number,
      default: 0,
    },
    versions: [paperVersionSchema],
  },
  { timestamps: true }
);

paperSchema.index({ title: "text", abstract: "text", keywords: "text" });

module.exports = mongoose.model("Paper", paperSchema);
