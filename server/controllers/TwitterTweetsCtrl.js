import Twitter from 'twitter';
import TwitterTweets from '../models/TwitterTweets';
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

    aggregateTweets: (req, res, next) => {
      console.log(req.body.screenName);
        let counter = 0,
            maxId;
        const aggregateTweetsRecursive = (screenName, maxId = undefined) => {
            twitter.get('statuses/user_timeline', {
                screen_name: screenName,
                // max of 200 per api call
                count: 200,
                max_id: maxId
            }, (error, tweets, response) => {
                if (error) console.log("Twitter Response Error : ", error);
                let tweetInfo = {};
                for (let i = 0; i < tweets.length - 1; i++) {
                    tweetInfo = {
                        screenname: screenName.toLowerCase(),
                        date: tweets[i].created_at,
                        body: tweets[i].text,
                        retweets: tweets[i].retweet_count,
                        favorites: tweets[i].favorite_count
                    };
                    TwitterTweets.create(tweetInfo, (error, response) => {
                        if (error) console.log(error);
                    });
                }
                counter += 200;
                maxId = tweets[tweets.length - 1].id;
                if (counter >= 3000 || tweets.length === 1) {
                    res.status(200).send('tweets aggregated');
                }
                aggregateTweetsRecursive(screenName, maxId);
            });
        };
        aggregateTweetsRecursive(req.body.screenName);
    },

    tweetEngagement: (req, res, next) => {
        TwitterTweets.find({
            date: {
                $gte: moment().subtract(7, 'days'),
                $lte: moment()
            },
            screenname: req.body.screenName
        }, (error, response) => {
            if (error) res.status(500).send(error);
            res.status(200).send(response);
        });
    },

    tweetAnalysis: (req, res, next) => {
        TwitterTweets.find({
                screenname: req.body.screenName
            })
            .exec((error, response) => {
                // Declare variabled for data tracking and analysis
                let tweets = response,
                    retweets = 0,
                    favorites = 0,
                    retweetsPerTweet,
                    favoritesPerTweet,
                    tweetTime,
                    tweetDay,
                    tweetEngagement,
                    topDayPercent,
                    topDayToPost = {
                        day: '',
                        engagement: 0,
                        percentOfTotal: 0
                    },
                    topHourToPost = {
                        hour: '',
                        engagement: 0,
                        percentOfTotal: 0
                    },
                    totalEngagement = 0,
                    engagementByDay = {
                        Sunday: 0,
                        Monday: 0,
                        Tuesday: 0,
                        Wednesday: 0,
                        Thursday: 0,
                        Friday: 0,
                        Saturday: 0
                    },
                    engagementByHour = {
                        "12:00 AM": 0,
                        "1:00 AM": 0,
                        "2:00 AM": 0,
                        "3:00 AM": 0,
                        "4:00 AM": 0,
                        "5:00 AM": 0,
                        "6:00 AM": 0,
                        "7:00 AM": 0,
                        "8:00 AM": 0,
                        "9:00 AM": 0,
                        "10:00 AM": 0,
                        "11:00 AM": 0,
                        "12:00 PM": 0,
                        "1:00 PM": 0,
                        "2:00 PM": 0,
                        "3:00 PM": 0,
                        "4:00 PM": 0,
                        "5:00 PM": 0,
                        "6:00 PM": 0,
                        "7:00 PM": 0,
                        "8:00 PM": 0,
                        "9:00 PM": 0,
                        "10:00 PM": 0,
                        "11:00 PM": 0,
                    },
                    postsByDay = {
                        Sunday: 0,
                        Monday: 0,
                        Tuesday: 0,
                        Wednesday: 0,
                        Thursday: 0,
                        Friday: 0,
                        Saturday: 0
                    },
                    tweetCount = tweets.length;
                // loop through tweets, populate variabled for data analysis
                _.forEach(tweets, (tweet) => {
                    tweetTime = moment(tweet.date).startOf('hour').format('LT');
                    tweetDay = moment(tweet.date).format('dddd');
                    engagementByDay[tweetDay] += (tweet.favorites + tweet.retweets);
                    engagementByHour[tweetTime] += (tweet.favorites + tweet.retweets);
                    totalEngagement += (tweet.favorites + tweet.retweets);
                    postsByDay[tweetDay] += 1;
                    retweets += tweet.retweets;
                    favorites += tweet.favorites;
                });
                _.forEach(engagementByDay, (value, key) => {
                    if (topDayToPost.engagement < value) topDayToPost = {
                        day: key,
                        engagement: value
                    };
                });
                _.forEach(engagementByHour, (value, key) => {
                    if (topHourToPost.engagement < value) topHourToPost = {
                        hour: key,
                        engagement: value
                    };
                });
                topDayToPost.percentOfTotal = Number((topDayToPost.engagement / totalEngagement * 100).toFixed(1));
                topHourToPost.percentOfTotal = Number((topHourToPost.engagement / totalEngagement * 100).toFixed(1));
                retweetsPerTweet = (retweets / tweetCount);
                favoritesPerTweet = (favorites / tweetCount);
                let analysisData = {
                    totalEngagement: totalEngagement,
                    retweetsPerTweet: retweetsPerTweet,
                    favoritesPerTweet: favoritesPerTweet,
                    postsByDay: postsByDay,
                    engagementByDay: engagementByDay,
                    engagementByHour: engagementByHour,
                    topDayToPost: topDayToPost,
                    topHourToPost: topHourToPost
                };
                res.status(200).send(analysisData);
            });
    }
};
