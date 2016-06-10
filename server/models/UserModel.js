import mongoose from 'mongoose';
import {Schema} from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
require('mongoose-schematypes-extend')(mongoose);



let UserSchema = new Schema({

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

  card: [
    {type: Schema.Types.ObjectId, ref: 'Card'}
  ],

  dataFiles: [String]
});

UserSchema.pre('save', (next) => {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10), null);
    next();
});

UserSchema.methods.verifyPassword = (reqBodyPassword) => {
    let user = this;
    return bcrypt.compareSync(reqBodyPassword, user.password);
};

module.exports = mongoose.model('User', UserSchema);
