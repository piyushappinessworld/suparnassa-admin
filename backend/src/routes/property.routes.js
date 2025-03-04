const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { upload } = require("../config/s3.config");
const {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/property.controller");

// Routes
router.post("/", protect, upload.array("images", 10), createProperty);
router.get("/", getProperties);
router.get("/:id", getProperty);
router.put("/:id", protect, upload.array("images", 10), updateProperty);
router.delete("/:id", protect, deleteProperty);

module.exports = router;
