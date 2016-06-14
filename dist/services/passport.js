'use strict';

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require('passport-local');

var _UserModel = require('../models/UserModel');

var _UserModel2 = _interopRequireDefault(_UserModel);

var _config = require('../config.js');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { Strategy as InstagramStrategy } from 'passport-instagram';


_passport2.default.use(new _passportLocal.Strategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, done) {
    _UserModel2.default.findOne({
        email: email
    }).exec(function (err, user) {
        if (err) {
            done(err);
        }
        if (!user) {
            return done(null, false);
        }
        if (user.verifyPassword(password)) {
            done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

// passport.use(new InstagramStrategy({
//     clientID: config.instagram.INSTAGRAM_CLIENT_ID,
//     clientSecret: config.instagram.INSTAGRAM_CLIENT_SECRET,
//     callbackURL: "http://localhost:9001/auth/instagram/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//     console.log(accessToken, refreshToken, profile);
//     // asynchronous verification, for effect...
//     // process.nextTick(function () {
//
//       // To keep the example simple, the user's Instagram profile is returned to
//       // represent the logged-in user.  In a typical application, you would want
//       // to associate the Instagram account with a user record in your database,
//       // and return that user instead.
//       // return done(null, profile);
//     // });
//   }
// ));

_passport2.default.serializeUser(function (user, done) {
    done(null, user._id);
});
_passport2.default.deserializeUser(function (_id, done) {
    _UserModel2.default.findById(_id, function (err, user) {
        done(err, user);
    });
});

module.exports = _passport2.default;