const mongoose = require('mongoose');
const validator = require('validator/validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'confirm your password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Passwords doesn't match",
    },
  },
  passwordChangedAt: Date,
});

//hashing password before saving it to DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // returns if password not modified

  this.password = await bcrypt.hash(this.password, 12); //hashing password

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (iat) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return iat < changedTimestamp;
  }
  return false;
};
module.exports = mongoose.model('User', userSchema);
