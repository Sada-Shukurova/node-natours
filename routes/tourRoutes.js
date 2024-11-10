import express from 'express';
import {
  aliasTopTours,
  createTour,
  deleteTourById,
  getAllTours,
  getMonthlyPlan,
  getTourById,
  getTourStats,
  updateTourById,
} from '../controllers/tourController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

// Param middleware
// router.param('id', (req, res, next, value) => {
//   console.log(`tour id is ${value}`);

//   next();
// });

// router.param('id', checkId);
// check body middleware

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(protect, getAllTours).post(createTour);

router
  .route('/:id')
  .get(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById);

export default router;
