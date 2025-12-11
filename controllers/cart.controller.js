const Cart = require("../models/Cart");
const Sweet = require("../models/Sweet");

// Get current user's cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }
    res.json(cart.items || []);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Replace the user's cart (set)
exports.setCart = async (req, res) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }
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
    cart.items = validated;
    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Merge provided items with existing cart (add quantities)
exports.mergeCart = async (req, res) => {
  try {
    const incoming = Array.isArray(req.body.items) ? req.body.items : [];
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    const map = new Map();
    // preload existing
    (cart.items || []).forEach((it) => {
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

    cart.items = merged;

    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add or update a single cart item (used for per-change sync)
exports.addOrUpdateItem = async (req, res) => {
  try {
    const { id, quantity } = req.body;
    if (!id) return res.status(400).json({ message: "Missing item id" });

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    const sweet = await Sweet.findById(id);
    if (!sweet) return res.status(400).json({ message: "Sweet not found" });

    // Check if item is out of stock
    if (sweet.quantity === 0) {
      return res.status(400).json({ message: "Item is out of stock" });
    }

    const requestedQty = Number(quantity || 1);
    const idx = cart.items.findIndex((it) => it.sweetId.toString() === id);
    const currentCartQty = idx >= 0 ? cart.items[idx].quantity : 0;
    const qtyDifference = requestedQty - currentCartQty;

    // If requested quantity exceeds available stock, return error
    if (qtyDifference > sweet.quantity) {
      return res.status(400).json({
        message: `Only ${sweet.quantity} items available in stock`,
        availableStock: sweet.quantity,
      });
    }

    const qty = Math.max(
      1,
      Math.min(requestedQty, sweet.quantity + currentCartQty)
    );

    if (qty <= 0) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Update stock: decrease by the difference
    if (qtyDifference > 0) {
      sweet.quantity -= qtyDifference;
      await sweet.save();
    } else if (qtyDifference < 0) {
      // Quantity decreased, restore stock
      sweet.quantity += Math.abs(qtyDifference);
      await sweet.save();
    }

    if (idx >= 0) {
      cart.items[idx].quantity = qty;
      cart.items[idx].price = sweet.price;
      cart.items[idx].name = sweet.name;
      cart.items[idx].image = sweet.image;
    } else {
      cart.items.push({
        sweetId: id,
        name: sweet.name,
        price: sweet.price,
        image: sweet.image,
        quantity: qty,
      });
    }
    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Remove a single item
exports.removeItem = async (req, res) => {
  try {
    const id = req.params.id;
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    // Find the item being removed to restore its stock
    const itemToRemove = cart.items.find((it) => it._id.toString() === id);
    if (itemToRemove) {
      // Restore stock back to the sweet
      const sweet = await Sweet.findById(itemToRemove.sweetId);
      if (sweet) {
        sweet.quantity += itemToRemove.quantity;
        await sweet.save();
      }
    }

    cart.items = cart.items.filter((it) => it._id.toString() !== id);
    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    // Restore stock for all items in cart before clearing
    for (const item of cart.items) {
      const sweet = await Sweet.findById(item.sweetId);
      if (sweet) {
        sweet.quantity += item.quantity;
        await sweet.save();
      }
    }

    cart.items = [];
    await cart.save();
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
