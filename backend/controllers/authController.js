const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');

// User Signup
exports.signup = async (req, res, next) => {
    const { email, password, name } = req.body;

    try {
        // Check if the user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return next(new ErrorResponse('User already exists!', 400));
        }

        // Create the new user
        const user = await User.create({
            name,
            email,
            password, // Password will be hashed by the pre-save hook in the User model
        });

        // Generate JWT token
        const token = user.getJwtToken();

        // Send success response with token
        res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        next(error); // Pass any unexpected errors to the error handler
    }
};

// User Login
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Validate email and password
        if (!email || !password) {
            return next(new ErrorResponse('Please provide an email and password!', 400));
        }

        // Check if user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new ErrorResponse('Invalid credentials!', 401));
        }

        // Check if the password matches
        const isMatched = await user.comparePassword(password);
        if (!isMatched) {
            return next(new ErrorResponse('Invalid credentials!', 401));
        }

        // Generate JWT token
        const token = user.getJwtToken();

        // Set cookie options
        const cookieOptions = {
            maxAge: 60 * 60 * 1000, // 1 hour
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        };

        // Send token in response and set cookie
        res.status(200)
            .cookie('token', token, cookieOptions)
            .json({
                success: true,
                message: 'Login successful!',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });
    } catch (error) {
        next(error); // Pass any unexpected errors to the error handler
    }
};

// User Logout
exports.logout = (req, res, next) => {
    // Clear the token cookie
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: 'User logged out successfully!',
    });
};

// User Profile
exports.userProfile = async (req, res, next) => {
    try {
        // Fetch user profile from the database
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return next(new ErrorResponse('User not found!', 404));
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error); // Pass any unexpected errors to the error handler
    }
};

// Test Route (Optional for testing purposes)
exports.testRoute = (req, res) => {
    res.status(200).json({ message: 'Test route is working!' });
};
