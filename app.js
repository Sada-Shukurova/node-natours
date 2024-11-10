import express from 'express';
import morgan from 'morgan';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';

export const app = express();

// #region middleware

// 3rd--party middleware
// if (process.env.NODE_ENV === 'development') {
app.use(morgan('dev'));

// buit-in middleware
app.use(express.json());
app.use(express.static('./public'));

// custom middleware
// app.use((req, res, next) => {
//   console.log('hello from the middleware🐈');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);

  next();
});

//#endregion

//#region route mounting
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// unhandled routes without error handling middleware
// app.all('*', (req, res, next) => {
//   res.status(404).json({
//     status: 'fail',
//     message: `Can't find ${req.originalUrl} on this server`,
//   });
// });

// unhandled routes with error handling middleware
// app.all('*', (req, res, next) => {
//   const err = new Error(`Can't find ${req.originalUrl} on this server`);
//   err.status = 'fail';
//   err.statusCode = 404;

//   next(err);
// });

//BETTER ERROR HANDLLING WITH CLASS ERROR HANDLER MIDDLEWARE
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server😥😞`, 404));
});

//#endregion

app.use(globalErrorHandler);
