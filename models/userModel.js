import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    trim: true,
    // maxlength: [20, 'A user name must have less or equal than 20 characters'],
    // minlength: [3, 'A user name must have more or equal than 3 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
    trim: true,
  },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'A password must have more or equal than 8 characters'],
    trim: true,
    select: false,
    // will add some more fields
    // match: [
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    //   'Password must contain at least one lowercase letter, one uppercase letter, and one number',
    // ],
  },
  passwordChangedAt: Date,
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm you parrword'],
    trim: true,
    validate: {
      //works on save
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match',
    },
  },

  //   createdAt: {
  //     type: Date,
  //     default: Date.now(),
  //     select: false,
  //   },
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
//if password changed
userSchema.methods.changedPasswordAfter = function (JWTTimestmp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(changedTimestamp, JWTTimestmp);
    return JWTTimestmp < changedTimestamp;
  }
  // not changed password
  return false;
};

const User = mongoose.model('User', userSchema);
export default User;
