const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/userModel');

// Check if user is authenticated
exports.isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;

<<<<<<< HEAD
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
=======
    // Log token to verify if it's being passed correctly
    console.log("Token from cookies:", token);

    // Make sure token exists
    if (!token) {
        return next(new errorResponse('Not Authorized to access this route', 401));
    }

    try {
        // Verify token and log the decoded data
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        // Find user based on decoded id and log the user
        req.user = await user.findById(decoded.id);
        console.log('User from DB:', req.user);

        // If no user found, respond with error
        if (!req.user) {
            return next(new errorResponse('User not found', 404));
        }

        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error('Error during token verification:', error);
        return next(new errorResponse('Not Authorized to access this route', 401));
>>>>>>> 700dd2461d28e4b85b7b803bcab7a5190384fb96
    }
};
