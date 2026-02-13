const mongoose = require("mongoose");

const learningSchema = new mongoose.Schema(
  {
    title: String,
    difficulty: String,
    status: {
      type: String,
      default: "Pending",
    },
    completedAt: Date, // ⭐ ADD THIS
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model("Learning", learningSchema);
