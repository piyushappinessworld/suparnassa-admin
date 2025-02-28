
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, admin } = require('../middleware/auth.middleware');
const {
  register,
  login,
  createAdmin,
  getProfile
} = require('../controllers/auth.controller');

// Validation middleware
const validateAuth = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
];

// Routes
router.post('/register', validateAuth, register);
router.post('/login', validateAuth, login);
router.post('/create-admin', createAdmin);
router.get('/profile', protect, getProfile);

module.exports = router;
