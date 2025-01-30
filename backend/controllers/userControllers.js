const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse'); 

// controllers/userControllers.js
exports.allUsers = async (req, res, next) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const count = await User.find({}).estimatedDocumentCount();

    try {
        const users = await User.find()
            .sort({ createdAt: -1 })
            .select('-password')
            .skip(pageSize * (page - 1))
            .limit(pageSize);

        res.status(200).json({
            success: true,
            data: users,
            page,
            pages: Math.ceil(count / pageSize),
            count,
        });
    } catch (error) {
        next(error);
    }
};
