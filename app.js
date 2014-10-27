var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('config');

var session = require('express-session');
var passport = require('passport');
var RedisStore = require('connect-redis')(session);

var routes = require('./routes/index');
var guess = require('./routes/guess');

var mongoose = require('mongoose');
mongoose.connect(config.get('db'));

var authRoutes = require('./auth/routes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
    store: new RedisStore(config.get('redis')), // uses Redis Server to store sessions
    secret: 'MEAN',
    resave: true,
    secure: false,
    maxAge: 86400000,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email']
}));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/app',
    failureRedirect: '/'
}));

app.get('/logout', authRoutes.logout);

app.use('/', routes);
app.use('/api/guess', guess);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
