import Twitter from 'twitter';
const ig = require('instagram-node').instagram();
import config from '../config.js';
import _ from 'lodash';
import Promise from 'bluebird';
import moment from 'moment';

const twitter = new Twitter({
    consumer_key: config.twitter.TWITTER_CONSUMER_KEY,
    consumer_secret: config.twitter.TWITTER_CONSUMER_SECRET,
    access_token_key: config.twitter.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: config.twitter.TWITTER_ACCESS_TOKEN_SECRET,
});

module.exports = {

    tweetData: (req, res, next) => {
        twitter.get('statuses/user_timeline', {
            screen_name: req.body.screenName,
            count: 5
        }, (error, tweets, response) => {
            for (let i = 0; i < tweets.length; i++) {
              console.log(tweets[i].created_at, moment(tweets[i].created_at).format('lll'), tweets[i].retweet_count, tweets[i].favorite_count);
              // console.log(moment(tweets[i].created_at).format('lll'));
            }
        });
    }
};

// const instagram = new Instagram({
//   ig_client_secret: config.instagram.CLIENT_SECRET,
//   ig_client_id: config.instagram.CLIENT_ID
// });
//
//
// module.exports = {
//
// }
