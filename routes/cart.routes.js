const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { authenticateJWT } = require("../middleware/auth.middleware");

router.get("/", authenticateJWT, cartController.getCart);
router.put("/", authenticateJWT, cartController.setCart);
router.post("/merge", authenticateJWT, cartController.mergeCart);
router.delete("/", authenticateJWT, cartController.clearCart);
router.post("/item", authenticateJWT, cartController.addOrUpdateItem);
router.delete("/item/:id", authenticateJWT, cartController.removeItem);

module.exports = router;
