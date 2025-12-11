const mongoose = require("mongoose");

const sweetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, default: "" },
  image: { type: String }, // URL to sweet image
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Sweet", sweetSchema);
