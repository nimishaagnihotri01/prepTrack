const express = require("express");
const router = express.Router();

router.post("/run", async (req, res) => {
  try {
    const { language, code } = req.body;

    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language,
        version: "*",
        files: [
          {
            content: code,
          },
        ],
      }),
    });

    const data = await response.json();

    res.json({
      output: data.run.output,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Code execution failed" });
  }
});

module.exports = router;
