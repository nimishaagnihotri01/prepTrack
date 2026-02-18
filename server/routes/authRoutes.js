const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const User = require("../models/user");
const sendMail = require("../utils/sendMail");

const { registerUser, loginUser } = require("../controllers/authController");

// ✅ REGISTER
router.post("/register", registerUser);

// ✅ LOGIN
router.post("/login", loginUser);

// ⭐ VERIFY ACCOUNT ROUTE
router.get("/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      verifyToken: req.params.token,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    user.isVerified = true;
    user.verifyToken = undefined;

    await user.save();

    res.json({ message: "Account verified successfully ✅" });

  } catch (err) {
    console.log("VERIFY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
