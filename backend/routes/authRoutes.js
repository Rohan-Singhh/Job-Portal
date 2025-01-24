const express = require('express');
const { signup, login, logout } = require('../controllers/authController'); // Import both functions
const router = express.Router();

// Auth routes
router.post('/signup', signup); // Route for signup
router.post('/login', login);   // Route for login
router.get('/logout', logout); // Route for logout
module.exports = router;
