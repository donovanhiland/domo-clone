'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TwitterLocationSchema = new _mongoose.Schema({
  screenName: {
    type: String,
    requried: true
  },
  date: {
    type: Date,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  cursor: Number
});

module.exports = _mongoose2.default.model('TwitterLocation', TwitterLocationSchema);