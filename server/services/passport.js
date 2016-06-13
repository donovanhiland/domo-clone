import passport from 'passport';
import {
   Strategy as LocalStrategy
} from 'passport-local';
// import { Strategy as InstagramStrategy } from 'passport-instagram';
import User from '../models/UserModel';
import config from '../config.js';

passport.use(new LocalStrategy({
   usernameField: 'email',
   passwordField: 'password'
}, function(email, password, done) {
   User.findOne({
           email: email
       })
       .exec(function(err, user) {
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

passport.serializeUser(function(user, done) {
   done(null, user._id);
});
passport.deserializeUser(function(_id, done) {
   User.findById(_id, function(err, user) {
       done(err, user);
   });
});

module.exports = passport;
