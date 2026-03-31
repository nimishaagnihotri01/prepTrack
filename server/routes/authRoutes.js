const express = require("express");
const router = express.Router();

const User = require("../models/user");
const protect = require("../middleware/authMiddleware");

router.post("/sync-user", protect, async (req, res) => {
  try {
    const name =
      req.body.name?.trim() || req.user.name?.trim() || "User";

    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      {
        $set: {
          email: req.user.email,
          name,
          isVerified: true,
        },
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      }
    );

    res.json(user);
  } catch (error) {
    console.log("SYNC USER ERROR:", error);
    res.status(500).json({ message: "Error syncing user" });
  }
});

module.exports = router;
