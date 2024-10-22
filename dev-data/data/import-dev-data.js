import fs from 'fs';
import Tour from '../../models/tourModel.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log('database connected successfully!'));

//reading json file
const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8')
);
//data to db
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data loaded successfully');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//delete old data
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data deleted successfully');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);
