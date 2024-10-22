// import fs from 'fs';
import Tour from '../models/tourModel.js';

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

export async function getAllTours(req, res) {
  try {
    // console.log(req.query);

    // const tours = await Tour.find();
    // const tours = await Tour.find({ duration: 5, difficulty: 'easy' });

    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // const tours = await Tour.find(req.query);
    // const query = Tour.find(queryObj);
    // advanced filtering
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    let query = Tour.find(JSON.parse(queryString));

    //SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
      //sort('price ratingsAverage')
    } else {
      query = query.sort('-createdAt');
    }
    // LIMIT
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');

      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    const tours = await query;
    // console.log(req.query, queryObj);

    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

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
