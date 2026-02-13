const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // ✅ NEW FREE MODEL
      messages: [
        {
          role: "system",
          content:
            "You are PrepTrack AI Assistant helping students with coding, DSA, MERN stack and productivity.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });
  } catch (error) {
    console.log("Groq AI Error:", error);
    res.status(500).json({ reply: "AI failed" });
  }
});

module.exports = router;
