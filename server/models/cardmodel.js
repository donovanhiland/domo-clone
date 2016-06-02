import mongoose from 'mongoose';

var Schema = mongoose.Schema
var cardSchema = new Schema({

    title: String,
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Card', cardSchema);