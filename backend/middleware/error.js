const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
    // Create a custom error object with default values
    let error = new ErrorResponse(err.message || "Server Error", err.statusCode || 500);

    // Handle Mongoose CastError (e.g., invalid ObjectId)
    if (err.name === "CastError") {
        const message = `Resource not found with id ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
        const message = "Duplicate field value entered";
        error = new ErrorResponse(message, 400);
    }

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map((val) => val.message)
            .join(', ');
        error = new ErrorResponse(message, 400);
    }

    // Send the response
    res.status(error.statusCode).json({
        success: false,
        error: error.message,
    });
};

module.exports = errorHandler;
