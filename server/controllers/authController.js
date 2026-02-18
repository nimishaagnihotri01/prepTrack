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

    // check existing user
    let user = await User.findOne({ email });

    // ⭐ If user exists but NOT verified → resend mail
    if (user && !user.isVerified) {
      const verifyToken = crypto.randomBytes(32).toString("hex");

      user.verifyToken = verifyToken;
      await user.save();

      await sendMail(user.email, verifyToken);

      return res.status(200).json({
        message:
          "Account exists but not verified. Verification email resent.",
      });
    }

    // if user already verified
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // create new user
    const hashedPassword = await bcrypt.hash(password, 10);

    const verifyToken = crypto.randomBytes(32).toString("hex");

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      verifyToken,
      isVerified: false,
    });

    // send verification email
    await sendMail(email, verifyToken);

    res.status(201).json({
      message: "Registered successfully. Please verify your email.",
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

    const user = await User.findOne({ verifyToken: token });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification link",
      });
    }

    user.isVerified = true;
    user.verifyToken = undefined;

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

    // ⭐ BLOCK LOGIN IF NOT VERIFIED
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
