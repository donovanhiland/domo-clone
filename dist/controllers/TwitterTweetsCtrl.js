'use strict';

var _twitter = require('twitter');

var _twitter2 = _interopRequireDefault(_twitter);

var _TwitterTweets = require('../models/TwitterTweets');

var _TwitterTweets2 = _interopRequireDefault(_TwitterTweets);

var _config = require('../config.js');

var _config2 = _interopRequireDefault(_config);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ig = require('instagram-node').instagram();


var twitter = new _twitter2.default({
    consumer_key: _config2.default.twitter.TWITTER_CONSUMER_KEY,
    consumer_secret: _config2.default.twitter.TWITTER_CONSUMER_SECRET,
    access_token_key: _config2.default.twitter.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: _config2.default.twitter.TWITTER_ACCESS_TOKEN_SECRET
});

module.exports = {

    aggregateTweets: function aggregateTweets(req, res, next) {
        var counter = 0,
            maxId = void 0;
        var aggregateTweetsRecursive = function aggregateTweetsRecursive(screenName) {
            var maxId = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

            twitter.get('statuses/user_timeline', {
                screen_name: req.body.screenName,
                // max of 200 per api call
                count: 200,
                max_id: maxId
            }, function (error, tweets, response) {
                if (error) console.log(error);
                console.log(tweets.length);
                var tweetInfo = {};
                for (var i = 0; i < tweets.length - 1; i++) {
                    tweetInfo = {
                        screenname: screenName.toLowerCase(),
                        date: tweets[i].created_at,
                        body: tweets[i].text,
                        retweets: tweets[i].retweet_count,
                        favorites: tweets[i].favorite_count
                    };
                    _TwitterTweets2.default.create(tweetInfo, function (error, response) {
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

    tweetEngagement: function tweetEngagement(req, res, next) {
        _TwitterTweets2.default.find({
            date: {
                $gte: (0, _moment2.default)().subtract(7, 'days'),
                $lte: (0, _moment2.default)()
            },
            screenname: req.body.screenName
        }, function (error, response) {
            if (error) res.status(500).send(error);
            res.status(200).send(response);
        });
    },

    tweetAnalysis: function tweetAnalysis(req, res, next) {
        _TwitterTweets2.default.find({
            screenname: req.body.screenName
        }).exec(function (error, response) {
            // Declare variabled for data tracking and analysis
            var tweets = response,
                retweets = 0,
                favorites = 0,
                retweetsPerTweet = void 0,
                favoritesPerTweet = void 0,
                tweetTime = void 0,
                tweetDay = void 0,
                tweetEngagement = void 0,
                topDayPercent = void 0,
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
                "11:00 PM": 0
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
            _lodash2.default.forEach(tweets, function (tweet) {
                tweetTime = (0, _moment2.default)(tweet.date).startOf('hour').format('LT');
                tweetDay = (0, _moment2.default)(tweet.date).format('dddd');
                engagementByDay[tweetDay] += tweet.favorites + tweet.retweets;
                engagementByHour[tweetTime] += tweet.favorites + tweet.retweets;
                totalEngagement += tweet.favorites + tweet.retweets;
                postsByDay[tweetDay] += 1;
                retweets += tweet.retweets;
                favorites += tweet.favorites;
            });
            _lodash2.default.forEach(engagementByDay, function (value, key) {
                if (topDayToPost.engagement < value) topDayToPost = {
                    day: key,
                    engagement: value
                };
            });
            _lodash2.default.forEach(engagementByHour, function (value, key) {
                if (topHourToPost.engagement < value) topHourToPost = {
                    hour: key,
                    engagement: value
                };
            });
            topDayToPost.percentOfTotal = Number((topDayToPost.engagement / totalEngagement * 100).toFixed(1));
            topHourToPost.percentOfTotal = Number((topHourToPost.engagement / totalEngagement * 100).toFixed(1));
            retweetsPerTweet = retweets / tweetCount;
            favoritesPerTweet = favorites / tweetCount;
            var analysisData = {
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