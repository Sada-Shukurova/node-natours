import express from 'express';
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from '../controllers/userController.js';
import { signup } from '../controllers/authController.js';

const router = express.Router();

// AUTH
router.post('/signup', signup);
// USERS
router.route('/').get(getAllUsers).post(createUser);
router
  .route('/:id')
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUserById);

export default router;
