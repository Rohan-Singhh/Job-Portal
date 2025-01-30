// routes/userRoutes.js
const express = require('express');
const { allUsers } = require('../controllers/userControllers');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

// Route for getting all users
router.get('/allusers', isAuthenticated, allUsers);

module.exports = router;
