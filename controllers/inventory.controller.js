const Sweet = require("../models/Sweet");

exports.purchaseSweet = async (req, res) => {
  const { sweetId, quantity } = req.body;
  if (!sweetId || !quantity) {
    return res
      .status(400)
      .json({ message: "sweetId and quantity are required" });
  }
  try {
    const sweet = await Sweet.findById(sweetId);
    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }
    if (sweet.quantity < quantity) {
      return res.status(400).json({ message: "Out of stock" });
    }
    sweet.quantity -= quantity;
    await sweet.save();
    res.json({ message: "Purchase successful", sweet });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
