// Require dependencies
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import config from './config.js';
import session from 'express-session';

import nodemailer from'nodemailer';

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '"Fred Foo 👥" <foo@blurdybloop.com>', // sender address
    to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world 🐴', // plaintext body
    html: '<b>Hello world 🐴</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});

// Controllers
import TwitterCtrl from './controllers/TwitterCtrl';
import UserCtrl from './controllers/UserCtrl.js';
import cardCtrl from './controllers/cardCtrl.js';

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
app.post('/users', UserCtrl.register);
app.get('/logout', UserCtrl.logout);
app.get('/users', UserCtrl.getUsers);
app.get('/me', isAuthed, UserCtrl.me);
app.put('/users/:_id', isAuthed, UserCtrl.update);
app.post('/login', passport.authenticate('local', {
    successRedirect: '/me'
}));
app.post('/card', cardCtrl.createCard);
app.get('/card', cardCtrl.readCard);
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
