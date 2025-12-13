const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders } = require("../controllers/order.controller");
const { authenticateJWT } = require("../middleware/auth.middleware");

// Create order (protected)
router.post("/", authenticateJWT, createOrder);

// Get current user's orders (protected)
router.get("/my", authenticateJWT, getMyOrders);

module.exports = router;
