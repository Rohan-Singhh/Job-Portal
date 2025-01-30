// routes/authRoutes.js
const express = require('express');
const { signup, login, logout, userProfile } = require('../controllers/authcontroller');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

// Auth routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', isAuthenticated, userProfile);

module.exports = router;
