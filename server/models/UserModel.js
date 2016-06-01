import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
require('mongoose-schematypes-extend')(mongoose);

import {Schema} from 'mongoose';


var User = new Schema({

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
    required: true
  },

  phoneNumber: {
    type: String
  },

  card: [
    {type: Schema.Types.ObjectId, ref: 'Card'}
  ]
});

User.pre('save', function(next) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10), null);
    next();
});

User.methods.verifyPassword = function(reqBodyPassword) {
    var user = this;
    return bcrypt.compareSync(reqBodyPassword, user.password);
};

module.exports = mongoose.model('User', User);
