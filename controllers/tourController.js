// import fs from 'fs';
import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/apiFeatures.js';

// reading data from json file
// const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`));

// export function checkId(req, res, next, value) {
// if (req.params.id * 1 > tours.length) {
//   return res.status(404).json({
//     status: 'fail',
//     message: 'invalid ID',
//   });
// }
// next();
// }
// export function checkBody(req, res, next) {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'There is no name or price',
//     });
//   }
//   next();
// }

// MIDDLEWARE ALIAS

export const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

export async function getAllTours(req, res) {
  try {
    // console.log(req.query);

    // const tours = await Tour.find();
    // const tours = await Tour.find({ duration: 5, difficulty: 'easy' });
    // FILTER
    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);

    // // const tours = await Tour.find(req.query);
    // // const query = Tour.find(queryObj);
    // // advanced filtering
    // let queryString = JSON.stringify(queryObj);
    // queryString = queryString.replace(
    //   /\b(gte|gt|lte|lt)\b/g,
    //   (match) => `$${match}`
    // );
    // let query = Tour.find(JSON.parse(queryString));

    //SORTING
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    //   //sort('price ratingsAverage')
    // } else {
    //   query = query.sort('-createdAt');
    // }
    // LIMIT
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');

    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // PAGINATION
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error('This page does not exist');
    // }

    // console.log(req.query, queryObj);

    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    //EXECUTING QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
}
// old version
// export function createTour(req, res) {
// const newId = tours[tours.length - 1].id + 1;
// const newTour = Object.assign({ id: newId }, req.body);
// const newTour = { ...req.body, id: newId };
// tours.push(newTour);
// fs.writeFile(
//   './dev-data/data/tours-simple.json',
//   JSON.stringify(tours),
//   (err) => {
//     if (err) {
//       return console.log(err);
//     }
//     res.status(201).json({
//       status: 'success',
//       data: {
//         tour: newTour,
//       },
//     });
//   }
// );
// }

export async function createTour(req, res) {
  // const newTour=new Tour({});
  // newTour.save();
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}
export async function getTourById(req, res) {
  // const id = +req.params.id;
  // const tour = tours.find((tour) => tour.id === id);
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
}
export async function updateTourById(req, res) {
  // const id = +req.params.id;
  // const tour = tours.find((tour) => tour.id === id);
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
}
export async function deleteTourById(req, res) {
  // const id = +req.params.id;
  // const tour = tours.find((tour) => tour.id === id);
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
}

// AGGREGATION PIPELINE: match and group
export async function getTourStats(req, res) {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          // _id: null,
          _id: { $toUpper: '$difficulty' },
          // _id: '$ratingsAverage',
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
        // $sort: { avgPrice: -1 },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } },
      // },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
}

// AGGREGATION PIPELINE: unwinding and projecting
export async function getMonthlyPlan(req, res) {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: { _id: 0 },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $limit: 12,
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
}
