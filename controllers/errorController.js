import AppError from '../utils/appError.js';

// CAST ERRORS
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// DUPLICATE FIELDS ERROR
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(.*?)\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
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
    let errCopy = { ...err, errmsg: err.errmsg };

    if (errCopy.name === 'CastError') errCopy = handleCastErrorDB(errCopy);
    if (errCopy.code === 11000) errCopy = handleDuplicateFieldsDB(errCopy);

    sendErrorProd(errCopy, res);
  }
};
