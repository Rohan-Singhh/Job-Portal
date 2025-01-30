// controllers/authcontroller.js
const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');

// User Signup
exports.signup = async (req, res, next) => {
    const { email, password, name } = req.body;

    try {
        const userExist = await User.findOne({ email });
        if (userExist) {
            return next(new ErrorResponse('User already exists!', 400));
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        const token = user.getJwtToken();

        return res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        next(error);
    }
};

// User Login
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return next(new ErrorResponse('Please provide an email and password!', 400));
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new ErrorResponse('Invalid credentials!', 401));
        }

        const isMatched = await user.comparePassword(password);
        if (!isMatched) {
            return next(new ErrorResponse('Invalid credentials!', 401));
        }

        const token = user.getJwtToken();

        const cookieOptions = {
            maxAge: 60 * 60 * 1000, // 1 hour
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        };

        return res.status(200)
            .cookie('token', token, cookieOptions)
            .json({
                success: true,
                message: 'Login successful!',
                token,
                user: { id: user._id, name: user.name, email: user.email },
            });
    } catch (error) {
        next(error);
    }
};

// User Logout
exports.logout = (req, res, next) => {
    res.clearCookie('token');
    return res.status(200).json({
        success: true,
        message: 'User logged out successfully!',
    });
};

// User Profile
exports.userProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return next(new ErrorResponse('User not found!', 404));
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};
