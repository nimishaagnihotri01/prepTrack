const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Learning = require("../models/Learning");

const normalizeDifficulty = (value) => {
  if (["Easy", "Medium", "Hard"].includes(value)) {
    return value;
  }

  return "Easy";
};

router.get("/", protect, async (req, res) => {
  try {
    const topics = await Learning.find({ user: req.user.email })
      .sort({
        createdAt: -1,
      })
      .lean();

    res.json(topics);
  } catch (err) {
    console.log("LEARNING FETCH ERROR:", err);
    res.status(500).json({ message: "Fetch failed" });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const normalizedTitle = req.body.title?.trim();

    if (!normalizedTitle) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTopic = new Learning({
      title: normalizedTitle,
      difficulty: normalizeDifficulty(req.body.difficulty),
      user: req.user.email,
    });

    const saved = await newTopic.save();
    res.status(201).json(saved);
  } catch (err) {
    console.log("LEARNING CREATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const deletedTopic = await Learning.findOneAndDelete({
      _id: req.params.id,
      user: req.user.email,
    });

    if (!deletedTopic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    console.log("LEARNING DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

router.patch("/:id", protect, async (req, res) => {
  try {
    const item = await Learning.findOne({
      _id: req.params.id,
      user: req.user.email,
    });

    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }

    if (item.status === "Completed") {
      item.status = "Pending";
      item.completedAt = null;
    } else {
      item.status = "Completed";
      item.completedAt = new Date();
    }

    await item.save();

    res.json(item);
  } catch (err) {
    console.log("LEARNING UPDATE ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;
