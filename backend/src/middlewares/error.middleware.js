import { ApiResponse } from "../utils/response.js";

class ErrorHandler {
  static handleAsync(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  static globalErrorHandler(err, req, res, next) {
    console.error("Error:", err);

    // Default error
    let error = {
      statusCode: err.statusCode || 500,
      message: err.message || "Internal Server Error",
    };

    // Mongoose validation error
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((val) => val.message);
      error = {
        statusCode: 400,
        message: "Validation Error",
        errors,
      };
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      error = {
        statusCode: 400,
        message: `${field} already exists`,
      };
    }

    // Mongoose CastError
    if (err.name === "CastError") {
      error = {
        statusCode: 400,
        message: "Invalid ID format",
      };
    }

    res.status(error.statusCode).json(ApiResponse.error(error.message, error.statusCode, error.errors));
  }

  static notFound(req, res, next) {
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.statusCode = 404;
    next(error);
  }
}

export default ErrorHandler;
