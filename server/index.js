// Require dependencies
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import config from './config.js';
import session from 'express-session';


// Controllers
import TwitterCtrl from './controllers/TwitterCtrl';
import UserCtrl from './controllers/UserCtrl.js';

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


// Endpoints
// app.get('/model', modelCtrl.read);
// app.post('/model', modelCtrl.create);
// app.put('/model/:id', modelCtrl.update);
// app.delete('/model/:id', modelCtrl.delete);
// TwitterCtrl.getDataByScreenName('devmtn');

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
app.get('/logout', function(req, res, next) {
    req.logout();
    return res.status(200).send('logged out');
});


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
