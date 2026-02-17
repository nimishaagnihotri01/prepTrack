const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Workspace = require("../models/Workspace");

// ⭐ LOAD OR CREATE WORKSPACE
router.get("/:taskId", protect, async (req, res) => {
  let workspace = await Workspace.findOne({
    user: req.user._id,
    taskId: req.params.taskId,
  });

  if (!workspace) {
    workspace = await Workspace.create({
      user: req.user._id,
      taskId: req.params.taskId,
    });
  }

  res.json(workspace);
});

// ⭐ AUTO SAVE CODE
router.post("/:taskId", protect, async (req, res) => {
  const { code, language } = req.body;

  let workspace = await Workspace.findOne({
    user: req.user._id,
    taskId: req.params.taskId,
  });

  if (!workspace) {
    workspace = await Workspace.create({
      user: req.user._id,
      taskId: req.params.taskId,
      code,
      language,
    });
  } else {
    workspace.code = code;
    workspace.language = language;
    await workspace.save();
  }

  res.json(workspace);
});

module.exports = router;
