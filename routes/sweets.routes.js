const express = require("express");
const router = express.Router();
const sweetsController = require("../controllers/sweets.controller");
const {
  authenticateJWT,
  requireAdmin,
} = require("../middleware/auth.middleware");
const multer = require("multer");
const path = require("path");

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get("/", sweetsController.getAllSweets);
router.get("/:id", sweetsController.getSweetById);
router.post(
  "/",
  authenticateJWT,
  requireAdmin,
  upload.single("image"),
  sweetsController.createSweet
);
router.put(
  "/:id",
  authenticateJWT,
  requireAdmin,
  upload.single("image"),
  sweetsController.updateSweet
);
router.delete(
  "/:id",
  authenticateJWT,
  requireAdmin,
  sweetsController.deleteSweet
);

module.exports = router;
