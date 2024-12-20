import AppError from '../utils/appError.js';

// CAST ERRORS
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// DUPLICATE FIELDS ERROR
const handleDuplicateFieldsDB = (err) => {
  const value = err.errorResponse.errmsg.match(/(["'])(\\?.*?)\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another`;
  return new AppError(message, 400);
};

// VALIDATION ERRROR
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data.${errors.join('. ')}`;
  return new AppError(message, 400);
};
//JWT Webtoken Error
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again', 401);
};
// JWT token expired error
const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again', 401);

// DEVELOPMENT ERROR
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// PRODUCTION ERROR
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR💥', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

// ERROR HANDLING MIDDLEWARE
export default (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // let errCopy = { ...err, errmsg: err.errmsg };
    let errCopy = JSON.parse(JSON.stringify(err));

    if (errCopy.name === 'CastError') errCopy = handleCastErrorDB(errCopy);
    if (errCopy.code === 11000) errCopy = handleDuplicateFieldsDB(errCopy);
    if (errCopy.name === 'ValidationError')
      errCopy = handleValidationErrorDB(errCopy);
    if (errCopy.name === 'JsonWebTokenError') errCopy = handleJWTError();
    if (errCopy.name === 'TokenExpiredError') errCopy = handleJWTExpiredError();

    sendErrorProd(errCopy, res);
  }
};
