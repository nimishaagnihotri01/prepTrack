const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Learning",
      required: true,
    },
    language: {
      type: String,
      enum: ["javascript", "python"],
      default: "javascript",
    },
    code: {
      type: String,
      default: "console.log('Start coding');",
    },
  },
  { timestamps: true }
);

workspaceSchema.index({ user: 1, taskId: 1 }, { unique: true });

module.exports = mongoose.model("Workspace", workspaceSchema);
