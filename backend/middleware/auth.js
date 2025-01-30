// middleware/auth.js
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/userModel');

// Check if user is authenticated
exports.isAuthenticated = async (req, res, next) => {
    // Get token from cookies
    const { token } = req.cookies;

    // Make sure the token exists
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        // Verify the token and decode it
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by decoded id
        const user = await User.findById(decoded.id);

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        // Attach the user to the request object
        req.user = user;
        return next(); // Ensure that we are not sending a response here
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            return next(new ErrorResponse('Token has expired', 401));
        }
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
};

// Middleware for admin access (optional)
exports.isAdmin = (req, res, next) => {
    if (req.user.role === 0) { // Assuming 0 is for normal users, and admin has a different role value
        return next(new ErrorResponse('Access Denied, you are not an admin', 401));
    }
    return next();
};
