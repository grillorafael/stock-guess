var express = require('express');
var router = express.Router();
var auth = require('../auth/auth');
var config = require('config');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index');
});

router.get('/app', auth.ensureAuthenticated, function(req, res) {
    var user = req.user;
    var hasUsername = !!user.username;
    var hasAgreed = user.agreed;
    var bonusWeek = config.get('bonusWeek');

    res.render('app', {
        bonusWeek: bonusWeek,
        user: user,
        hasUsername: hasUsername,
        hasAgreed: hasAgreed
    });
});

router.get('/partials/:name', auth.ensureAuthenticated, function(req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
});

router.get('/shared/:name', auth.ensureAuthenticated, function(req, res) {

    var name = req.params.name;
    res.render('shared/' + name);
});

module.exports = router;
