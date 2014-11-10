var express = require('express');
var router = express.Router();
var auth = require('../auth/auth');
var Close = require('../models/close');
var Guess = require('../models/guess');
var User = require('../models/user');
var config = require('config');
var ObjectId = require('mongoose').Types.ObjectId;
var Q = require('q');
require('datejs');

var usernameRegex = /^[a-z0-9_-]{3,16}$/i;

function generateRank() {
    var weightMap = config.get('weights');

    var maxLose = 500;
    var maxWin = 1000;

    var lowLoseLimiar = 20;
    var hightLoseLimiar = 180;
    var normalizationLimitar = lowLoseLimiar + hightLoseLimiar;

    var loseSlice = maxLose / 20;
    var winSlice = maxWin / 80;

    var scoreToSum = 0;

    Close.getUnranked().then(function(close) {
        var date1 = close.start;
        var date2 = close.end;

        // Get an unranked Close
        for(var stockName in close.values) {
            close.values[stockName] = {
                current: close.values[stockName],
                minValue: Number.POSITIVE_INFINITY,
                maxVale: Number.NEGATIVE_INFINITY
            };
        }

        // Indexed by userId
        var usersScore = {};

        Guess.averageBetween(date1, date2).then(function(averages) {
            // Averages structure

            Guess.between(date1, date2).then(function(guesses) {
                // All guesses between date

                guesses.forEach(function(guess, index, arr) {
                    if(!usersScore[guess._user._id]) {
                        usersScore[guess._user._id] = {
                            value: 0,
                            weight: 0
                        };
                    }

                    // Setting min and max value per stocks
                    if(guess.stockValue < close.values[guess.stockName].minValue) {
                        close.values[guess.stockName].minValue = guess.stockValue;
                    }

                    if(guess.stockValue > close.values[guess.stockName].maxVale) {
                        close.values[guess.stockName].maxVale = guess.stockValue;
                    }

                    var percent = (guess.stockValue / close.values[guess.stockName].current) * 100;
                    // 0 -> Infinto

                    var day = guess.createdAt.getDay();
                    // 0 sunday -> 6 saturday

                    var dayWeight = weightMap[day];

                    if(percent <= lowLoseLimiar || percent > hightLoseLimiar) {
                        usersScore[guess._user._id].weight += dayWeight['-'];

                        if(percent >= (lowLoseLimiar + hightLoseLimiar)) {
                            usersScore[guess._user._id].value -= (maxLose * dayWeight['-']);
                            guess.score = (scoreToSum * dayWeight['-']);
                        }
                        else {
                            if(percent > hightLoseLimiar) {
                                // If 190 -> 10
                                percent = normalizationLimitar - percent;
                            }

                            scoreToSum = (lowLoseLimiar - percent) * loseSlice;

                            usersScore[guess._user._id].value -= (scoreToSum * dayWeight['-']);
                            guess.score = (scoreToSum * dayWeight['-']);
                        }
                    }
                    else if(percent > lowLoseLimiar && percent <= hightLoseLimiar) {
                        usersScore[guess._user._id].weight += dayWeight['+'];
                        if(percent > 100) {
                            // If 101 -> 99
                            percent = normalizationLimitar - percent;
                        }

                        scoreToSum = (percent - lowLoseLimiar) * winSlice;
                        usersScore[guess._user._id].value += (scoreToSum * dayWeight['+']);
                        guess.score = (scoreToSum * dayWeight['+']);
                    }

                    guess.save(function(err) {});
                });

                for(var userId in usersScore) {
                    usersScore[userId].value = usersScore[userId].value / usersScore[userId].weight;
                    User.findOne({
                        _id: userId
                    }).exec(function(err, user) {
                        if(user) {
                            user.score += usersScore[user._id].value;
                            user.score = user.score.toFixed(2);
                            user.save(function(err) {});
                        }
                    });
                }
            });
        });

        Close.findByIdAndUpdate(close._id, {
            $set: {
                ranked: true
            }
        }, function (err, tank) {
            if (err) {
                console.log('Error saving Close', err);
            }
            else {
                console.log('Sucess saving close');
            }
        });
    });
}


router.get('/make/rank', function(req, res) {
    generateRank();
    res.json({});
});

router.get('/global/score', function(req, res) {
    User
        .find()
        .sort('-score')
        .select('-_id username score fbId')
        .exec(function(err, users) {
            console.log(err);
            console.log(users);
            if(users.length > 0) {
                var myRank = 0;
                users.forEach(function(el, index, arr) {
                    if(el.fbId == req.user.fbId) {
                        console.log('FOUND');
                        arr[index].current = true;
                        myRank = index + 1;
                    }

                    delete arr[index].fbId;
                });

                res.json({
                    myRank: myRank,
                    rank: users
                });
            }
            else {
                res.json({
                    myRank: 0,
                    rank: []
                });
            }
        });
});

router.post('/agree', function(req, res) {
    User.findOne({
        _id: req.user._id
    }).exec(function(err, user) {
        if(user) {
            user.agreed = true;
            user.save(function(err) {
                res.redirect('/app');
            });
        }
        else {
            res.redirect('/app');
        }
    });
});

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

router.get('/bonus/choice/avaliable', function(req, res) {
    var bonusWeek = config.get('bonusWeek');
    if(bonusWeek) {
        var choices = config.get('bonusStocks').slice(0);
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
    }
    else {
        res.json({});
    }
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
