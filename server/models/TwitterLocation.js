import mongoose from 'mongoose';
import {Schema} from 'mongoose';

const TwitterLocationSchema = new Schema({
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

module.exports = mongoose.model('TwitterLocation', TwitterLocationSchema);
