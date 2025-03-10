const ErrorResponse = require('./core.errorResponse');

/**
 *
 * @param {any} err
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @returns
 */
const errorHandler = (err, req, res, next) => {
  let error = Object.assign(new ErrorResponse(), err);
   error.message = err.message || "Server Error";

  if (process.env.MODE !== 'production') {
    console.log(err.name, "Error name");
    // console.log(err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `I am Not A Teapot ${Object.values(err.errors).map(
      (val) => `${val.path} : ${val.value}`
    )}`;
    error = new ErrorResponse(message, 420);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error Cause By Foregin Key (This would Over The Pervious Validation)
  //TODO: fix or implenment
  // if (err.name === 'ValidationError') {
  //   console.log(err.errors);
  //   const message = Object.values(err.errors).map((val) => val.message);
  //   error = new ErrorResponse(message, 400);
  // }
 
  console.log(error, "error and error", err)
  return res.status(error.statusCode || 500).json({
    success: false,
    status: "error",
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
