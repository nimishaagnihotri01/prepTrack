const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const protect = require("../middleware/authMiddleware");
const Learning = require("../models/Learning");

const getGroqClient = () =>
  new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

router.post("/chat", protect, async (req, res) => {
  try {
    const message = req.body.message?.trim();

    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res
        .status(503)
        .json({ reply: "AI service is not configured" });
    }

    const learning = await Learning.find({
      user: req.user.email,
    })
      .select("difficulty status")
      .lean();

    const stats = learning.reduce(
      (accumulator, item) => {
        accumulator.total += 1;

        if (item.status === "Completed") {
          accumulator.completed += 1;
        }

        if (item.difficulty === "Easy") {
          accumulator.easy += 1;
        }

        if (item.difficulty === "Medium") {
          accumulator.medium += 1;
        }

        if (item.difficulty === "Hard") {
          accumulator.hard += 1;
        }

        return accumulator;
      },
      {
        total: 0,
        completed: 0,
        easy: 0,
        medium: 0,
        hard: 0,
      }
    );

    const systemContext = `
You are PrepTrack AI Assistant.

User Stats:
Total Topics: ${stats.total}
Completed Topics: ${stats.completed}
Easy: ${stats.easy}
Medium: ${stats.medium}
Hard: ${stats.hard}

Give personalized study advice based on this data.
`;

    const groq = getGroqClient();
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
