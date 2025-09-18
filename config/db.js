const mongoose = require("mongoose");

let MONGO_URI;
if (process.env.NODE_ENV === "test") {
  MONGO_URI = "mongodb://localhost:27017/sweetshop_test";
} else {
  MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/sweetshop";
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // Avoid process.exit during tests
    if (process.env.NODE_ENV === "test") {
      throw err;
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
