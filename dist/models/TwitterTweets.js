'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TweetDataSchema = new _mongoose.Schema({
  screenname: String,
  date: {
    type: Date,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  retweets: {
    type: Number,
    required: true
  },
  favorites: {
    type: Number,
    required: true
  }
});

module.exports = _mongoose2.default.model('TweetData', TweetDataSchema);