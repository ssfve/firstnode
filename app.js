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
let db_image_api = require('./routes/db-image-api');
let db_user_api = require('./routes/db-user-api');
let folder = require('./routes/folder');

// 3000 is default for nodejs
//const PORT = process.env.PORT || 5000;
let getlogger = require('./log4js.js');
let logger = getlogger('appLog');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json({limit:'100mb'}));
app.use(bodyParser.urlencoded({ extended: true,limit:'100mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {

    if(req.method === "OPTIONS"){
        logger.info("req with options received");
        res.header('Access-Control-Allow-Origin', "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        // cookies
        res.header('Access-Control-Allow-Credentials', "true");
        res.end();
    }else {
        res.header('Access-Control-Allow-Origin', "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        res.header('Access-Control-Allow-Credentials', "true");
        next();
    }
});

// app.use(bodyParser.json({limit: '50mb', type: 'application/json'}));
// app.use(bodyParser());
app.use('/', index);
app.use('/users', users);
app.use('/games', games);
app.use('/folder', folder);
app.use('/database', database.router);
app.use('/button', db_button_api);
app.use('/guide', db_guide_api.router);
app.use('/page', db_page_api.router);
app.use('/text', db_text_api.router);
app.use('/image', db_image_api.router);
app.use('/user', db_user_api.router);

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