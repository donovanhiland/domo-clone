import mongoose from 'mongoose';
import {Schema} from 'mongoose';

const TweetDataSchema = new Schema({
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
  },
});

module.exports = mongoose.model('TweetData', TweetDataSchema);
