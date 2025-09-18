const Sweet = require("../models/Sweet");

exports.getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.json(sweets);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getSweetById = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: "Sweet not found" });
    res.json(sweet);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.createSweet = async (req, res) => {
  try {
    // Debug log to inspect incoming data
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    // Explicitly extract fields from req.body to avoid issues with form-data parsing
    const sweetData = {
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category,
    };
    if (req.file) {
      sweetData.image = `/uploads/${req.file.filename}`;
    }
    const sweet = new Sweet(sweetData);
    await sweet.save();
    res.status(201).json(sweet);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating sweet", error: err.message });
  }
};

exports.updateSweet = async (req, res) => {
  try {
    let sweetData = req.body;
    if (req.file) {
      sweetData.image = `/uploads/${req.file.filename}`;
    }
    const sweet = await Sweet.findByIdAndUpdate(req.params.id, sweetData, {
      new: true,
    });
    if (!sweet) return res.status(404).json({ message: "Sweet not found" });
    res.json(sweet);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error updating sweet", error: err.message });
  }
};

exports.deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);
    if (!sweet) return res.status(404).json({ message: "Sweet not found" });
    res.json({ message: "Sweet deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting sweet", error: err.message });
  }
};
