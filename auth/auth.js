/**
 *  Route middleware to ensure user is authenticated.
 */
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
    if(!req.isAuthenticated()) {
        res.send(401);
    }
    else {
        return next();
    }
};
