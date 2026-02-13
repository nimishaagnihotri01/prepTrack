const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Learning = require("../models/Learning");

// ✅ GET ALL TOPICS
router.get("/", protect, async (req, res) => {
  const topics = await Learning.find({ user: req.user._id });
  res.json(topics);
});

// ✅ CREATE NEW TOPIC
router.post("/", protect, async (req, res) => {
  try {
    const { title, difficulty } = req.body;

    const newTopic = new Learning({
      title,
      difficulty,
      user: req.user._id,
    });

    const saved = await newTopic.save();
    res.status(201).json(saved);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE TOPIC
router.delete("/:id", protect, async (req, res) => {
  await Learning.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ⭐ UPDATE STATUS
router.patch("/:id", protect, async (req, res) => {
  try {
    const item = await Learning.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }

    if (item.status === "Completed") {
      item.status = "Pending";
      item.completedAt = null;
    } else {
      item.status = "Completed";
      item.completedAt = new Date(); // ⭐ SAVE REAL COMPLETION TIME
    }

    await item.save();

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});


module.exports = router;
