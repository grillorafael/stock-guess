'use_strict';

var auth = require('./auth.js'),
    passport = require('passport'),
    authRoutes = require('./routes.js'),
    pass = require('./pass.js');

// exports.login = function(req, res) {
//     passport.authenticate('local', function(err, user, info) {
//         if (err) {
//             res.json({
//                 success: false
//             });
//         }
//         if (!user) {
//             res.json({
//                 success: false
//             });
//         }
//         req.logIn(user, function(err) {
//             if (err) {
//                 res.json({
//                     success: false
//                 });
//             }
//             res.json({
//                 success: true
//             });
//         });
//     })(req, res);
// };

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};
