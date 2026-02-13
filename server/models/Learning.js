const mongoose = require("mongoose");

const learningSchema = new mongoose.Schema(
  {
    title: String,
    difficulty: String,
    status: {
      type: String,
      default: "Pending",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true } // ⭐ VERY IMPORTANT
);


module.exports = mongoose.model("Learning", learningSchema);
