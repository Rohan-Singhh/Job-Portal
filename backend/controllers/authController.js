const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');

// User signup
exports.signup = async (req, res, next) => {
    const { email } = req.body;

    try {
        // Check if the user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return next(new ErrorResponse('User already exists, dude!', 400));
        }

        // Create the new user
        const user = await User.create(req.body);

        // Send success response
        res.status(201).json({
            success: true,
            message: 'User registered successfully!',
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

// User login
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Validate email and password
        if (!email) {
            return next(new ErrorResponse('Please provide an email!', 403));
        }
        if (!password) {
            return next(new ErrorResponse('Please provide a password!', 403));
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorResponse('Account not found. Please sign up first!', 400));
        }

        // Check if the password matches
        const isMatched = await user.comparePassword(password);
        if (!isMatched) {
            return next(new ErrorResponse('Invalid password. Please try again!', 400));
        }

        // Send token response
        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error); // Pass any unexpected errors to the error handler
    }
};

// Generate and send JWT token in response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getJwtToken();

    // Set cookie options
    const cookieOptions = {
        maxAge: 60 * 60 * 1000, // 1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    };

    res
        .status(statusCode)
        .cookie('token', token, cookieOptions)
        .json({
            success: true,
            message: 'Authentication successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
};


// logout
exports.logout = (req,res,next)=>{
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: 'User logged out successfully!'
    })
}


// test  file to test