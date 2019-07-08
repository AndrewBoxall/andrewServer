var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var config = require('./config/config');
var logger = require('morgan');

var lamodeRouter = require('./routes/lamode');
var portfolioRouter = require('./routes/portfolio');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));

app.use('/lamode', express.static(path.join(__dirname, 'public/lamode/build')));
app.use(express.static(path.join(__dirname, 'public/portfolio/build')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/lamode', function(req, res, next) {
  //req.config = {};
  //req.config.emailpassword = config.portfolio.emailpassword;
  //req.config.emailusername = config.portfolio.emailusername;
  next();
}, lamodeRouter);

app.use('/portfolio', function(req, res, next) {
  req.config = {};
  req.config.emailpassword = config.portfolio.emailpassword;
  req.config.emailusername = config.portfolio.emailusername;
  next();
}, portfolioRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
