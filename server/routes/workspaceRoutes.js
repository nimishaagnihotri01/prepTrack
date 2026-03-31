const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const protect = require("../middleware/authMiddleware");
const User = require("../models/user");
const Workspace = require("../models/Workspace");

const SUPPORTED_LANGUAGES = new Set(["javascript", "python"]);

const normalizeLanguage = (language) =>
  SUPPORTED_LANGUAGES.has(language) ? language : "javascript";

const findOrMigrateWorkspace = async (email, taskId) => {
  const workspace = await Workspace.findOne({
    user: email,
    taskId,
  });

  if (workspace) {
    return workspace;
  }

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return null;
  }

  const dbUser = await User.findOne({ email }).select("_id").lean();

  if (!dbUser) {
    return null;
  }

  const legacyWorkspace = await Workspace.collection.findOne({
    user: dbUser._id,
    taskId: new mongoose.Types.ObjectId(taskId),
  });

  if (!legacyWorkspace) {
    return null;
  }

  await Workspace.collection.updateOne(
    { _id: legacyWorkspace._id },
    {
      $set: {
        user: email,
      },
    }
  );

  return Workspace.findById(legacyWorkspace._id);
};

router.get("/:taskId", protect, async (req, res) => {
  try {
    let workspace = await findOrMigrateWorkspace(
      req.user.email,
      req.params.taskId
    );

    if (!workspace) {
      workspace = await Workspace.create({
        user: req.user.email,
        taskId: req.params.taskId,
      });
    }

    res.json(workspace);
  } catch (error) {
    console.log("WORKSPACE LOAD ERROR:", error);
    res.status(500).json({ message: "Failed to load workspace" });
  }
});

router.post("/:taskId", protect, async (req, res) => {
  try {
    const language = normalizeLanguage(req.body.language);
    const code =
      typeof req.body.code === "string" ? req.body.code : "";

    let workspace = await findOrMigrateWorkspace(
      req.user.email,
      req.params.taskId
    );

    if (!workspace) {
      workspace = new Workspace({
        user: req.user.email,
        taskId: req.params.taskId,
      });
    }

    workspace.code = code;
    workspace.language = language;
    await workspace.save();

    res.json(workspace);
  } catch (error) {
    console.log("WORKSPACE SAVE ERROR:", error);
    res.status(500).json({ message: "Failed to save workspace" });
  }
});

module.exports = router;
