'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('mongoose-schematypes-extend')(_mongoose2.default);

var UserSchema = new _mongoose.Schema({

  firstname: {
    type: String,
    trim: true,
    required: true,
    capitalize: true,
    nomultispaces: true
  },

  lastname: {
    type: String,
    trim: true,
    required: true,
    capitalize: true,
    nomultispaces: true
  },

  email: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: false
  },

  phoneNumber: {
    type: String
  },

  card: [{ type: _mongoose.Schema.Types.ObjectId, ref: 'Card' }],

  dataFiles: [String]
});

UserSchema.pre('save', function (next) {
  this.password = _bcryptNodejs2.default.hashSync(this.password, _bcryptNodejs2.default.genSaltSync(10), null);
  next();
});

UserSchema.methods.verifyPassword = function (reqBodyPassword) {
  var user = this;
  return _bcryptNodejs2.default.compareSync(reqBodyPassword, user.password);
};

module.exports = _mongoose2.default.model('User', UserSchema);