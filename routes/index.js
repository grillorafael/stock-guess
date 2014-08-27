var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index');
});

router.get('/partials/:name', function(req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
});

router.get('/shared/:name', function(req, res) {
    var name = req.params.name;
    res.render('shared/' + name);
});

module.exports = router;
