const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const User = require("../models/user");

// ✅ GET USER PROFILE
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.log("PROFILE ERROR:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

module.exports = router;
