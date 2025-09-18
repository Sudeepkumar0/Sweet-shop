const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB only if not in test environment
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Sample route
app.get("/", (req, res) => {
  res.json({ message: "Sweet Shop API running" });
});

module.exports = app;
// Auth routes
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// Sweets routes
const sweetsRoutes = require("./routes/sweets.routes");
app.use("/api/sweets", sweetsRoutes);

// Inventory routes
const inventoryRoutes = require("./routes/inventory.routes");
app.use("/api/inventory", inventoryRoutes);
