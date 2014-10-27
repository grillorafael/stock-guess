/**
 *  Route middleware to ensure user is authenticated.
 */
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
    var isAjax = req.xhr;
    if(!req.isAuthenticated()) {
        if(isAjax) {
            res.send(401);
        }
        else {
            res.redirect('/');
        }
    }
    else {
        return next();
    }
};
