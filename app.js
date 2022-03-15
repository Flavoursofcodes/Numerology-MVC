var createError = require('http-errors');
var express = require('express');
var path = require('path');
const session = require('express-session')
const MongoDBSession = require('connect-mongodb-session')(session)
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const jwt = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');
const router = require('./router')
var flash = require('connect-flash')
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var reportRouter = require('./routes/report');
const uri = "mongodb+srv://shourya123:shourya123@ellipcluster.ar2u2.mongodb.net/numero1?retryWrites=true&w=majority"

const store = new MongoDBSession({
    uri: uri,
    collection: "sessionData"
})

var app = express();
app.use(session({
    secret: "UCMHP ACADEMY",
    resave: true,
    saveUninitialized: true,
    store: store,
    cookie:{
        maxAge: 24 * 60 * 60 * 1000
    }
}))
app.use(function (req, res, next) {
    // res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
    ; next();
});
app.use(flash())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'resources')));
// app.use(jwt());


app.use('/', router);
// app.use('/auth', indexRouter);
// app.use('/users', usersRouter);
// app.use('/report', reportRouter);

app.use(errorHandler);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send('error');
});

module.exports = app;
