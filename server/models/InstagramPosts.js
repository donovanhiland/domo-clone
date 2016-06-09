import mongoose from 'mongoose';
import {Schema} from 'mongoose';

const InstagramDataSchema = new Schema({
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

module.exports = mongoose.model('InstagramData', InstagramDataSchema);
