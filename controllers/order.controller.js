const Order = require("../models/Order");

// Create an order (without payment for now)
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { items, shipping, billing, subtotal, tax, total, status } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    const order = await Order.create({
      user: userId,
      items,
      shipping,
      billing,
      subtotal,
      tax,
      total,
      status: status || "pending",
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("createOrder error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get orders for the logged-in user
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json(orders);
  } catch (err) {
    console.error("getMyOrders error", err);
    res.status(500).json({ message: "Server error" });
  }
};
