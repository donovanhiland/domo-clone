import mongoose from 'mongoose';
import {Schema} from 'mongoose';
import bcrypt from 'bcryptjs';
require('mongoose-schematypes-extend')(mongoose);



var UserSchema = new Schema({

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
  ],

  dataFiles: [String]
});

UserSchema.pre('save', function(next) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10), null);
    next();
});

UserSchema.methods.verifyPassword = function(reqBodyPassword) {
    var user = this;
    return bcrypt.compareSync(reqBodyPassword, user.password);
};

module.exports = mongoose.model('User', UserSchema);
