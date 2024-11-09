import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // SEND response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});
export function createUser(req, res) {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
}
export function getUserById(req, res) {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
}
export function updateUserById(req, res) {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
}
export function deleteUserById(req, res) {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
}
