const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Learning",
    },
    language: {
      type: String,
      default: "javascript",
    },
    code: {
      type: String,
      default: "console.log('Start Coding 🚀');",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workspace", workspaceSchema);
