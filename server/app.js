const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const testroutes = require("./routes/testroutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const learningRoutes = require("./routes/learningRoutes");
const aiRoutes = require("./routes/aiRoutes");
const codeRoutes = require("./routes/codeRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");

const app = express();

const normalizeOrigin = (value) => value.replace(/\/$/, "");

const parseAllowedOrigins = () => {
  const configuredOrigins = [
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGINS,
  ]
    .filter(Boolean)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean)
    .map(normalizeOrigin);

  return [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    ...configuredOrigins,
  ];
};

const allowedOrigins = parseAllowedOrigins();

const matchesAllowedOrigin = (origin) => {
  const normalizedOrigin = normalizeOrigin(origin);

  return allowedOrigins.some((allowedOrigin) => {
    if (allowedOrigin === normalizedOrigin) {
      return true;
    }

    if (!allowedOrigin.includes("*")) {
      return false;
    }

    const pattern = new RegExp(
      `^${allowedOrigin
        .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
        .replace(/\\\*/g, "[^.\\/]+")}$`
    );

    return pattern.test(normalizedOrigin);
  });
};

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || matchesAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    dbState: mongoose.connection.readyState,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/test", testroutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/workspace", workspaceRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  if (error.message === "Origin not allowed by CORS") {
    return res.status(403).json({ message: error.message });
  }

  console.error("UNHANDLED ERROR:", error);
  return res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
