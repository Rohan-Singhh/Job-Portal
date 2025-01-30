const errorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const user = require("../models/userModel");

// check if user is authenticated
exports.isAuthenticated = async(req, res, next) => {
    const { token } = req.cookies;
    // make sure token exists;
    if(!token){
        return next(new errorResponse('Not Authorised to access to this route', 401));
    }
    try {
        // verify token
        const decoded  = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await user.findById(decoded.id); 
        next();
    } catch (error) {
        return next(new errorResponse('Not Authorised to access to this route', 401));   
    }
};
