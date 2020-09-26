const ErrorResponse = require('../utils/errorResponse');

const errorHandle = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;
  console.log(err);

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // profile not found
  if (err.kind == 'ObjectId') {
    const message = 'Profile not found';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandle;
