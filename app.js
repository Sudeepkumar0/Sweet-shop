const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Sample route
app.get("/", (req, res) => {
  res.json({ message: "Sweet Shop API running" });
});

module.exports = app;
// Auth routes
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);
