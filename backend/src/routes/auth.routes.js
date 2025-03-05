const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { protect } = require("../middleware/auth.middleware");
const {
  login,
  getProfile,
  updateCredentials,
} = require("../controllers/auth.controller");

const validateAuth = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
];

const validateUpdateCredentials = [
  body("email").optional().isEmail().normalizeEmail(),
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .optional()
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
];

// Routes
router.post("/login", validateAuth, login);
router.get("/profile", protect, getProfile);
router.put("/update-credentials", protect, validateAuth, updateCredentials);

module.exports = router;
