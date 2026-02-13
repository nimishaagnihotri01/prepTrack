const express = require("express");
const cors = require("cors");
require("dotenv").config();

const testroutes = require("./routes/testroutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const learningRoutes = require("./routes/learningRoutes"); // ⭐ ADD THIS
const aiRoutes = require("./routes/aiRoutes");

const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/test", testroutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/learning", learningRoutes); // ⭐ ADD THIS
app.use("/api/ai", aiRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
