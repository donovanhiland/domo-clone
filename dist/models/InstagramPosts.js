'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InstagramDataSchema = new _mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  likes: {
    type: Number,
    required: true
  },
  comments: {
    type: Number,
    required: true
  }
});

module.exports = _mongoose2.default.model('InstagramData', InstagramDataSchema);