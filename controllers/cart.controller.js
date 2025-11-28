const User = require("../models/User");
const Sweet = require("../models/Sweet");

// Get current user's cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("cart");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.cart || []);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Replace the user's cart (set)
exports.setCart = async (req, res) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    // validate items - ensure sweet exists and respect available quantity
    const validated = [];
    for (const it of items) {
      const id = it._id || it.sweetId || it.id;
      if (!id) continue;
      const sweet = await Sweet.findById(id).lean();
      if (!sweet) continue;
      const qty = Math.max(
        1,
        Math.min(Number(it.quantity || 1), sweet.quantity || 0)
      );
      if (qty <= 0) continue;
      validated.push({
        sweetId: id,
        name: sweet.name || it.name,
        price: sweet.price || it.price,
        image: sweet.image || it.image,
        quantity: qty,
      });
    }
    user.cart = validated;
    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Merge provided items with existing cart (add quantities)
exports.mergeCart = async (req, res) => {
  try {
    const incoming = Array.isArray(req.body.items) ? req.body.items : [];
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const map = new Map();
    // preload existing
    (user.cart || []).forEach((it) => {
      map.set(it.sweetId?.toString(), {
        ...(it.toObject ? it.toObject() : it),
      });
    });

    incoming.forEach((it) => {
      const id = it._id || it.sweetId || it.id;
      const qty = Number(it.quantity || 1);
      if (!id) return;
      // validate sweet exists and available quantity
      // We'll defer availability check after accumulation
      if (map.has(id)) {
        map.get(id).quantity = (map.get(id).quantity || 0) + qty;
      } else {
        map.set(id, {
          sweetId: id,
          name: it.name,
          price: it.price,
          image: it.image,
          quantity: qty,
        });
      }
    });

    // validate against DB and cap by available quantity
    const merged = [];
    for (const [id, it] of map.entries()) {
      const sweet = await Sweet.findById(id).lean();
      if (!sweet) continue; // skip non-existent
      const qty = Math.max(
        1,
        Math.min(Number(it.quantity || 1), sweet.quantity || 0)
      );
      if (qty <= 0) continue;
      merged.push({
        sweetId: id,
        name: sweet.name || it.name,
        price: sweet.price || it.price,
        image: sweet.image || it.image,
        quantity: qty,
      });
    }

    user.cart = merged;

    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add or update a single cart item (used for per-change sync)
exports.addOrUpdateItem = async (req, res) => {
  try {
    const { id, quantity } = req.body;
    if (!id) return res.status(400).json({ message: "Missing item id" });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const sweet = await Sweet.findById(id).lean();
    if (!sweet) return res.status(400).json({ message: "Sweet not found" });
    const qty = Math.max(
      1,
      Math.min(Number(quantity || 1), sweet.quantity || 0)
    );
    if (qty <= 0)
      return res.status(400).json({ message: "Insufficient stock" });

    const idx = user.cart.findIndex((it) => it.sweetId == id);
    if (idx >= 0) {
      user.cart[idx].quantity = qty;
    } else {
      user.cart.push({
        sweetId: id,
        name: sweet.name,
        price: sweet.price,
        image: sweet.image,
        quantity: qty,
      });
    }
    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Remove a single item
exports.removeItem = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.cart = (user.cart || []).filter((it) => it.sweetId != id);
    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.cart = [];
    await user.save();
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
