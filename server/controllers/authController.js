const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendMail = require("../utils/sendMail");

// 🔐 GENERATE JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

//
// ✅ REGISTER USER
//
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    // 🔥 CASE 1: User exists but NOT verified → resend email
    if (user && !user.isVerified) {
      const verifyToken = crypto.randomBytes(32).toString("hex");

      user.verifyToken = verifyToken;
      user.verifyTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
      await user.save();

      // ✅ SEND TOKEN (NOT LINK)
      await sendMail(user.email, verifyToken);

      return res.status(200).json({
        message:
          "Account exists but not verified. Verification email resent.",
      });
    }

    // 🔥 CASE 2: User already verified
    if (user) {
      return res.status(400).json({
        message: "User already exists. Please login.",
      });
    }

    // 🔥 CREATE NEW USER
    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      verifyToken,
      verifyTokenExpiry: Date.now() + 60 * 60 * 1000, // 1 hour
      isVerified: false,
    });

    // ✅ SEND TOKEN (NOT LINK)
    await sendMail(email, verifyToken);

    res.status(201).json({
      message:
        "Registered successfully. Please verify your email before logging in.",
    });
  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

//
// ✅ VERIFY EMAIL
//
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification link",
      });
    }

    user.isVerified = true;
    user.verifyToken = null;
    user.verifyTokenExpiry = null;

    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.log("VERIFY ERROR:", err);
    res.status(500).json({ message: "Verification failed" });
  }
};

//
// ✅ LOGIN USER
//
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 🔒 BLOCK IF NOT VERIFIED
    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email before logging in",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      token: generateToken(user._id),
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
};