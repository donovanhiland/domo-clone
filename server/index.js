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

const corsOptions = {
  origin: '*'
};

// initilize dependencies
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(session({
  secret: config.SESSION_SECRET,
  saveUninitialized: false,
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + './../public'));

// UserEndpoint
app.get('/checkAuth', UserCtrl.checkAuth);
app.post('/users', UserCtrl.register);
app.get('/logout', UserCtrl.logout);
app.get('/users', UserCtrl.getUsers);
app.get('/me', isAuthed, UserCtrl.me);
app.put('/users/:_id', isAuthed, UserCtrl.update);
app.post('/login', passport.authenticate('local', {
    successRedirect: '/me'
}));
//card
app.post('/card', CardCtrl.createCard);
app.get('/card', CardCtrl.readCard);
app.delete('/card/:id', CardCtrl.deleteCard);
//email
app.post('/email', FormCtrl.sendEmail);

//=======uncomment this for testing=======//
app.post('/followers', TwitterLocationCtrl.getDataByScreenName);
app.post('/tweetData', TwitterTweetsCtrl.tweetData);

// MongoDB connection
mongoose.set('debug', true);
mongoose.connect(config.mongoURI);
mongoose.connection.once('open', () => {
    console.log('Connected to mongo at: ', config.mongoURI);
});


// App Listen
app.listen(config.port, () => {
    console.log('listening on port ', config.port);
});
