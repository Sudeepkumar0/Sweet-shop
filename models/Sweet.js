const mongoose = require("mongoose");

const sweetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String }, // URL to sweet image
});

module.exports = mongoose.model("Sweet", sweetSchema);
