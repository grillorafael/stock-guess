var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    config = require('config'),
    User = require('../models/user');

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({
        _id: id
    }, function(err, user) {
        done(err, user);
    });
});

passport.use(new FacebookStrategy({
        clientID: config.get('fb.id'),
        clientSecret: config.get('fb.secret'),
        callbackURL: config.get('fb.redirect')
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({
            fbId: profile.id
        }).exec(function(err, user) {
            if(!user) {
                user = new User();
                if(profile.emails && profile.emails.length >= 1) {
                    user.email = profile.emails[0].value;
                }
                user.fbId = profile.id;
                user.fbToken = accessToken;
                user.name = profile.displayName;
                user.gender = profile.gender;
                user.save(function(err) {
                    done(null, user);
                });
            }
            else {
                user.fbToken = accessToken;
                user.email = profile.emails[0].value;
                user.save(function(err) {
                    done(null, user);
                });
            }
        });
    }
));
