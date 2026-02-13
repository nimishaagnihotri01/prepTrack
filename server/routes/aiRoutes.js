const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const protect = require("../middleware/authMiddleware");
const Learning = require("../models/Learning");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ⭐ SMART AI CHAT
router.post("/chat", protect, async (req, res) => {
  try {
    const { message } = req.body;

    // 🔥 FETCH USER LEARNING DATA
    const learning = await Learning.find({
      user: req.user._id,
    });

    const total = learning.length;
    const completed = learning.filter(
      (item) => item.status === "Completed"
    ).length;

    const easy = learning.filter(
      (i) => i.difficulty === "Easy"
    ).length;

    const medium = learning.filter(
      (i) => i.difficulty === "Medium"
    ).length;

    const hard = learning.filter(
      (i) => i.difficulty === "Hard"
    ).length;

    // ⭐ CREATE SMART CONTEXT FOR AI
    const systemContext = `
You are PrepTrack AI Assistant.

User Stats:
Total Topics: ${total}
Completed Topics: ${completed}
Easy: ${easy}
Medium: ${medium}
Hard: ${hard}

Give personalized study advice based on this data.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: systemContext,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.log("Groq AI Error:", error);
    res.status(500).json({ reply: "AI failed" });
  }
});

module.exports = router;
