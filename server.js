import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: './config.env' });
import { app } from './app.js';

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log('DB connected successfully!'));

// listening
const port = process.env.PORT || 2306;
const server = app.listen(port, () => {
  console.log(`App running on port: ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message, '🥲🥲');
  console.log('UNHANDLED REJECTION!💥Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
