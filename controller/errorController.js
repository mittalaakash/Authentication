const ShowError = require('../utils/ShowError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new ShowError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/"(.*?)"/)[1];
  //   console.log(value);
  const message = `Email already exists: ${value}. Please use another email!`;
  return new ShowError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ShowError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  let error = Object.create(err);

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  res.status(error.statusCode).json({
    status: error.status,
    // error: error,
    message: error.message,
    // stack: err.stack, //for development
  });
};
