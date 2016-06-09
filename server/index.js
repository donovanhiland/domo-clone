// Require dependencies
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import config from './config.js';
import session from 'express-session';
import nodemailer from 'nodemailer';

// Controllers
import TwitterLocationCtrl from './controllers/TwitterLocationCtrl';
import TwitterTweetsCtrl from './controllers/TwitterTweetsCtrl';
import UserCtrl from './controllers/UserCtrl.js';
import TextCtrl from './controllers/TextCtrl.js';
import CardCtrl from './controllers/CardCtrl.js';
import FormCtrl from './controllers/FormCtrl.js';

// POLICIES //
const isAuthed = (req, res, next) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    return next();
};

// SERVICES //
import passport from './services/passport.js';

// initilize app
const app = express();

// initilize dependencies
app.use(cors());
app.use(bodyParser.json());
app.use(session({
  secret: config.SESSION_SECRET,
  saveUninitialized: false,
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + './../public'));

// User Endpoints
app.get('/checkAuth', UserCtrl.checkAuth);
app.post('/users', UserCtrl.register);
app.get('/logout', UserCtrl.logout);
app.get('/users', UserCtrl.getUsers);
app.get('/me', UserCtrl.me);
app.put('/users/:_id', UserCtrl.update);
app.post('/login', passport.authenticate('local', {
    successRedirect: '/me'
}));

// Card Endpoints
app.post('/card', CardCtrl.createCard);
app.get('/card', CardCtrl.readCard);
app.delete('/card/:id', CardCtrl.deleteCard);

// Email Endpoints
app.post('/email', FormCtrl.sendEmail);

// Texting Endpoints
app.post('/text', TextCtrl.sendText);

// Twitter Data Endpoints
app.post('/followers/location', TwitterLocationCtrl.getDataByScreenName);
app.post('/tweets/aggregate', TwitterTweetsCtrl.aggregateTweets);
app.post('/tweets/engagement', TwitterTweetsCtrl.tweetEngagement);
app.post('/tweets/analysis', TwitterTweetsCtrl.tweetAnalysis);

// MongoDB connection
// mongoose.set('debug', true);
mongoose.connect(config.mongoURI);
mongoose.connection.once('open', () => {
    console.log('Connected to mongo at: ', config.mongoURI);
});


// App Listen
app.listen(config.port, () => {
    console.log('listening on port ', config.port);
});
