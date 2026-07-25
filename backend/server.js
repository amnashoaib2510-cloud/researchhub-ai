require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

// Route imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const paperRoutes = require("./routes/paperRoutes");
const aiRoutes = require("./routes/aiRoutes");
const taskRoutes = require("./routes/taskRoutes");
const discussionRoutes = require("./routes/discussionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

// Connect to MongoDB (skipped automatically if MONGO_URI is not reachable in a demo env)
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Static file serving for uploaded papers
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "ResearchHub AI API is running" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/papers", paperRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ResearchHub AI server running on port ${PORT}`);
});
