const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/userModel');

// Check if user is authenticated
exports.isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;

    // Make sure token exists
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        // Log token for debugging
        console.log('Token:', token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Log decoded token
        console.log('Decoded Token:', decoded);

        const user = await User.findById(decoded.id);

        // Log user retrieval
        console.log('User:', user);

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new ErrorResponse('Token has expired', 401));
        }
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
};
