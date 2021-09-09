const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');

const userController = require('./controller/userController');
const errorController = require('./controller/errorController');
const ShowError = require('./utils/showError');

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use(cors());
app.options('*', cors());

app.use(mongoSanitize());

app.use(xss());

app.use(compression());

app.post('/api/users/signup', userController.signup);
app.post('/api/users/login', userController.login);
app.get('/api/users/logout', userController.logout);
app.use(userController.secure);
app.patch('/api/users/updatePassword', userController.updatePassword);
app.patch('/api/users/updateData', userController.updateData);

app
  .route('/api/users/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser);

app.use('*', (req, res, next) => {
  next(new ShowError(`${req.originalUrl} not available on this server`, 404));
});
app.use(errorController);
module.exports = app;
