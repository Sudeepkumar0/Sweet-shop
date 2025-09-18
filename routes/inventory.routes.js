const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory.controller");

router.post("/purchase", inventoryController.purchaseSweet);

module.exports = router;
