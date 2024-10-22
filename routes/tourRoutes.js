import express from 'express';
import {
  aliasTopTours,
  createTour,
  deleteTourById,
  getAllTours,
  getTourById,
  updateTourById,
} from '../controllers/tourController.js';

const router = express.Router();

// Param middleware
// router.param('id', (req, res, next, value) => {
//   console.log(`tour id is ${value}`);

//   next();
// });

// router.param('id', checkId);
// check body middleware

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/').get(getAllTours).post(createTour);

router
  .route('/:id')
  .get(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById);

export default router;
