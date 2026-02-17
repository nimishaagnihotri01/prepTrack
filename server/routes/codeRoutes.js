const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

// ⭐ CREATE TEMP CODE FOLDER
const codeDir = path.join(__dirname, "../temp");

if (!fs.existsSync(codeDir)) {
  fs.mkdirSync(codeDir);
}

// ⭐ RUN CODE LOCALLY
router.post("/run", protect, async (req, res) => {
  try {
    const { code, language } = req.body;

    const fileId = uuid();
    let filePath;
    let command;

    // ⭐ JAVASCRIPT EXECUTION
    if (language === "javascript") {
      filePath = path.join(codeDir, `${fileId}.js`);
      fs.writeFileSync(filePath, code);

      command = `node ${filePath}`;
    }

    // ⭐ PYTHON EXECUTION
    if (language === "python") {
      filePath = path.join(codeDir, `${fileId}.py`);
      fs.writeFileSync(filePath, code);

      command = `python ${filePath}`;
    }

    exec(command, (error, stdout, stderr) => {
      // delete file after run
      fs.unlinkSync(filePath);

      if (error) {
        return res.json({ output: stderr });
      }

      res.json({
        output: stdout || "No Output",
      });
    });

  } catch (err) {
    console.log("LOCAL EXEC ERROR 👉", err);
    res.status(500).json({ message: "Execution failed" });
  }
});

module.exports = router;
