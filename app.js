let express = require('express');
let path = require('path');

let favicon = require('serve-favicon');
//let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let index = require('./routes/index');
let users = require('./routes/users');
let games = require('./routes/games');
let database = require('./routes/database');
let db_button_api = require('./routes/db-button-api');
let db_guide_api = require('./routes/db-guide-api');
let db_page_api = require('./routes/db-page-api');
let db_text_api = require('./routes/db-text-api');
let folder = require('./routes/folder');

// 3000 is default for nodejs
//const PORT = process.env.PORT || 5000;


let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/games', games);
app.use('/folder', folder);
app.use('/database', database);
app.use('/button', db_button_api);
app.use('/guide', db_guide_api.router);
app.use('/page', db_page_api.router);
app.use('/text', db_text_api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
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
//app.use(router);
//app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

module.exports = app;