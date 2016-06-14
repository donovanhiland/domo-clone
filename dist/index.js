'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('./config.js');

var _config2 = _interopRequireDefault(_config);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _TwitterLocationCtrl = require('./controllers/TwitterLocationCtrl');

var _TwitterLocationCtrl2 = _interopRequireDefault(_TwitterLocationCtrl);

var _TwitterTweetsCtrl = require('./controllers/TwitterTweetsCtrl');

var _TwitterTweetsCtrl2 = _interopRequireDefault(_TwitterTweetsCtrl);

var _UserCtrl = require('./controllers/UserCtrl.js');

var _UserCtrl2 = _interopRequireDefault(_UserCtrl);

var _TextCtrl = require('./controllers/TextCtrl.js');

var _TextCtrl2 = _interopRequireDefault(_TextCtrl);

var _CardCtrl = require('./controllers/CardCtrl.js');

var _CardCtrl2 = _interopRequireDefault(_CardCtrl);

var _FormCtrl = require('./controllers/FormCtrl.js');

var _FormCtrl2 = _interopRequireDefault(_FormCtrl);

var _passport = require('./services/passport.js');

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// POLICIES //

// import InstagramPostsCtrl from './controllers/InstagramPostsCtrl.js';


// Controllers
var isAuthed = function isAuthed(req, res, next) {
    if (!req.isAuthenticated()) return res.status(401).send();
    return next();
};

// SERVICES //
// Require dependencies


// initilize app
var app = (0, _express2.default)();

// initilize dependencies
app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json());
app.use((0, _expressSession2.default)({
    secret: _config2.default.SESSION_SECRET,
    saveUninitialized: false,
    resave: false
}));
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());
app.use(_express2.default.static(__dirname + './../public'));

// User Endpoints
app.get('/checkAuth', _UserCtrl2.default.checkAuth);
app.post('/users', _UserCtrl2.default.register);
app.get('/logout', _UserCtrl2.default.logout);
app.get('/users', _UserCtrl2.default.getUsers);
app.get('/me', isAuthed, _UserCtrl2.default.me);
app.put('/users/:_id', isAuthed, _UserCtrl2.default.update);
app.post('/login', _passport2.default.authenticate('local', {
    successRedirect: '/me'
}));

// Card Endpoints
app.post('/card', _CardCtrl2.default.createCard);
app.get('/card', _CardCtrl2.default.readCard);
app.delete('/card/:id', _CardCtrl2.default.deleteCard);

// Email Endpoints
app.post('/email', _FormCtrl2.default.sendEmail);

// Texting Endpoints
app.post('/text', _TextCtrl2.default.sendText);

// Twitter Data Endpoints
app.post('/location/aggregate', _TwitterLocationCtrl2.default.getDataByScreenName);
app.get('/location/data', _TwitterLocationCtrl2.default.formatLocationDataFromDB);
app.post('/tweets/aggregate', _TwitterTweetsCtrl2.default.aggregateTweets);
app.post('/tweets/engagement', _TwitterTweetsCtrl2.default.tweetEngagement);
app.post('/tweets/analysis', _TwitterTweetsCtrl2.default.tweetAnalysis);

// // Instagram Data Endpoints
// app.get('/instagram/authorize_user', InstagramPostsCtrl.authorize_user);
// app.get('/instagram/handleauth', InstagramPostsCtrl.handleauth);
// app.get('/instagram/aggregate', InstagramPostsCtrl.aggregateInstaPosts);

// MongoDB connection
// mongoose.set('debug', true);
_mongoose2.default.connect(_config2.default.mongoURI);
_mongoose2.default.connection.once('open', function () {
    console.log('Connected to mongo at: ', _config2.default.mongoURI);
});

// App Listen
app.listen(_config2.default.port, function () {
    console.log('listening on port ', _config2.default.port);
});