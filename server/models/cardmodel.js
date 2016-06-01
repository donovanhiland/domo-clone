import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
require('mongoose-schematypes-extend')(mongoose);

var cardSchema = new mongoose.Schema({

    title: String

});

module.exports = mongoose.model('Card', cardSchema);
