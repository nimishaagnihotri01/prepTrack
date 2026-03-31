const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { execFile, spawnSync } = require("child_process");
const fs = require("fs/promises");
const path = require("path");
const { promisify } = require("util");
const { v4: uuid } = require("uuid");

const codeDir = path.join(__dirname, "../temp");
const execFileAsync = promisify(execFile);

const LANGUAGE_CONFIG = {
  javascript: {
    extension: "js",
    runtimes: [{ command: "node", args: [] }],
  },
  python: {
    extension: "py",
    runtimes: [
      { command: "python", args: [] },
      { command: "python3", args: [] },
      { command: "py", args: ["-3"] },
    ],
  },
};

const runtimeCache = new Map();

const resolveRuntime = (language) => {
  if (runtimeCache.has(language)) {
    return runtimeCache.get(language);
  }

  const config = LANGUAGE_CONFIG[language];

  if (!config) {
    runtimeCache.set(language, null);
    return null;
  }

  const runtime = config.runtimes.find(({ command, args }) => {
    const result = spawnSync(command, [...args, "--version"], {
      windowsHide: true,
      encoding: "utf8",
    });

    return !result.error && result.status === 0;
  });

  const resolved = runtime
    ? { extension: config.extension, ...runtime }
    : null;

  runtimeCache.set(language, resolved);
  return resolved;
};

router.post("/run", protect, async (req, res) => {
  let filePath;

  try {
    const { code, language } = req.body;
    const runtime = resolveRuntime(language);

    if (!runtime) {
      return res.status(400).json({
        output:
          "Language not supported in this environment. Choose an installed runtime.",
      });
    }

    if (typeof code !== "string") {
      return res.status(400).json({ output: "Code must be a string." });
    }

    const fileId = uuid();
    filePath = path.join(codeDir, `${fileId}.${runtime.extension}`);

    await fs.mkdir(codeDir, { recursive: true });
    await fs.writeFile(filePath, code, "utf8");

    const { stdout, stderr } = await execFileAsync(
      runtime.command,
      [...runtime.args, filePath],
      {
        timeout: 5000,
        maxBuffer: 1024 * 1024,
        windowsHide: true,
      }
    );

    res.json({
      output: stdout || stderr || "No Output",
    });
  } catch (err) {
    const output =
      err.stderr?.toString().trim() ||
      err.stdout?.toString().trim() ||
      err.message ||
      "Execution failed";

    console.log("LOCAL EXEC ERROR:", output);
    res.status(200).json({ output });
  } finally {
    if (filePath) {
      await fs.unlink(filePath).catch(() => {});
    }
  }
});

module.exports = router;
