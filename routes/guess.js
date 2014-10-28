var express = require('express');
var router = express.Router();
var auth = require('../auth/auth');
var Guess = require('../models/guess');
var User = require('../models/user');
var config = require('config');
var ObjectId = require('mongoose').Types.ObjectId;
require('datejs');
var usernameRegex = /^[a-z0-9_-]{3,16}$/;

router.post('/username', function(req, res) {
    var params = req.body;

    User.findOne({
        _id: req.user._id
    }).exec(function(err, user) {
        if(user && !user.username) {
            user.username = params.username;
            user.save(function(error) {
                res.json({
                    err: error
                });
            });
        }
        else {
            res.json({
                err: true
            });
        }
    });
});

router.get('/has/username', function(req, res) {
    User.findOne({
        _id: req.user._id
    }).exec(function(err, user) {
        res.json({
            hasUsername: user.username && usernameRegex.test(user.username)
        });
    });
});

router.get('/available', function(req, res) {
    var availableStocks = config.get('availableStocks');
    res.json(availableStocks);
});

router.get('/nextDate', function(req, res) {
    res.json({
        nextDate: Date.today().next().friday()
    });
});

router.get('/choice/avaliable', function(req, res) {
    var choices = config.get('availableStocks').slice(0);
    var user = req.user;

    Guess.find({
        _user: user._id,
        createdAt: {
            $gt: Date.today()
        }
    }).exec(function(err, guesses) {
        guesses.forEach(function(el, index) {
            var idx = choices.indexOf(el.stockName);
            if(idx !== -1) {
                choices.splice(idx, 1);
            }
        });

        res.json({
            stockName: choices[Math.floor(Math.random()*choices.length)]
        });
    });
});

/* GET home page. */
router.post('/', function(req, res) {
    var user = req.user;
    var params = req.body;
    params._user = user._id;

    Guess.findOne({
        _user: user._id,
        stockName: params.stockName,
        createdAt: {
            $gt: Date.today()
        }
    }).exec(function(err, guess) {
        if(!guess) {
            guess = new Guess(params);
            guess.save(function(err) {
                res.json({
                    error: err,
                    guess: guess
                });
            });
        }
        else {
            res.json({
                error: {

                }
            });
        }
    });
});

router.get('/me', function(req, res) {
    var user = req.user;
    Guess.find({
        _user: user._id
    }).sort('-createdAt').exec(function(err, guesses) {
        res.json(guesses);
    });
});

module.exports = router;
