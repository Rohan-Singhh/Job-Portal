const express = require('express');
const { signup, login, logout, userProfile } = require('../controllers/authcontroller'); // Import both functions
const router = express.Router();
const {isAuthenticated} = require('../middleware/auth');

// Auth routes
router.post('/signup', signup); // Route for signup
router.post('/login', login);   // Route for login
router.get('/logout', logout); // Route for logout
router.get('/me',userProfile); // Route for me 
module.exports = router;
