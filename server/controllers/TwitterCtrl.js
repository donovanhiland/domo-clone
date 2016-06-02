import Twitter from 'twitter';
import config from '../config.js';
import _ from 'lodash';

// Geocoder
let geocoderProvider = 'google';
let httpAdapter = 'https';
let extra = {
    apiKey: config.google.GOOGLE_API_KEY, // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};
let geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

const twitter = new Twitter({
    consumer_key: config.twitter.TWITTER_CONSUMER_KEY,
    consumer_secret: config.twitter.TWITTER_CONSUMER_SECRET,
    access_token_key: config.twitter.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: config.twitter.TWITTER_ACCESS_TOKEN_SECRET,
});

module.exports = {

    // The ideas was to use the twitter api to get location of a user's followers.
    // Unfortunately twitter api put all kinds of limiters on calling for information.
    // I can get 75,000 follower ids every 15 minutes, but only 18,000 user objects with information every 15 minutes.
    // This mismatch of numbers makes it hard to do the calls without storing the follower ids somewhere
    // To make matters worse, the location on the user object is entered in by the user and not formatted at all. It's not always even there.
    // When it is there it's very often formatted different which makes it hard to keep track and tally
    // I looked into google's geocoder api to solve this problem. You can query their database with the locations (formatted or not) and it will spit back a formatted address that can be used to tally location for data analysis.
    // Unfortunately their api only allows 2500 hits per day. When working with twitter accounts with millions of followers this just doesn't work.
    // For now we're going to have to just limit the data selection to 2500 to make things work. Will look into other solutions in the future.

    // The below function is set up to cooperate with the api limits of twitter
    // 15 calls every 15 minutes. The max count is 5000, but it can be set to however many ids you want
    // It will check to see if there are any more ids left to get and if not will break out, if there are ids left to get and the max calls are reached will wait 15 minutes to start again
    // the pagination is tracked by a cursor returned from the api call, which is tracked by the function and stored in cursotTracker
    getDataByScreenName: (screenName) => {
        //     //=== gets followers ids from screen name ===//
        //     let cursorTracker = -1;
        //     let limitTracker = 0;
        //         const getFollowerIds = () => {
        //             if (limitTracker === 14 || cursorTracker === 0) {
        //                 if (limitTracker === 14) {
        //                     console.log('max tries reached');
        //                     setTimeout(getFollowerIds(), 96000);
        //                 }
        //                 if (cursorTracker === 0) {
        //                     console.log('finished');
        //                 }
        //                 limitTracker = 0;
        //                 return;
        //             }
        //             twitter.get('followers/ids', {
        //                 screen_name: screenName,
        //                 cursor: cursorTracker,
        //                 count: 5000
        //                     // this call can get up to 5000 ids, and can be called 15 times every 15 minutes. 75,000 followers can be retrieved every 15 minutes.
        //             }, (error, ids, response) => {
        //                 if (error) {
        //                     console.log(error);
        //                     if (error[0].code === 88) {
        //                    // error code 88 is the code sent back from twitter when the limit has been reached
        //                         limitTracker = 14;
        //                     }
        //                 }
        //                 let idsList = ids.ids.join(',');
        //                 cursorTracker = ids.next_cursor;
        //                 limitTracker++;
        //                 console.log(idsList);
        //                 console.log(cursorTracker);
        //                 getFollowerIds();
        //             });
        //         };
        //         getFollowerIds();

        //=== gets users by user id ===//
        //twitter.get('users/lookup', {
        //     user_id: idsList
        //         // This call can be passed a maximum of 100 user ids at a time. With user auth the endpoint can be hit 180 times every 15 minutes: 18,000 users every 15 minutes.
        //         // With app auth the endpoint can be hit 60 times every 15 minutes: 6000 users every 15 minutes.
        // }, (error, user, response) => {
        //     if (error) console.log(error);
        //     let trimmedArray = [];
        //     for(let i = 0; i < user.length; i++) {
        //       if(user[i].location) {
        //         trimmedArray.push(user[i].location);
        //       }
        //     }
        //     for (let i = 0; i < trimmedArray.length; i++) {
        //         console.log(trimmedArray[i]);
        //     }
        // });

        let idsList;
        //call for followers ids
        twitter.get('followers/ids', {
            screen_name: screenName,
            count: 300
        }, (error, ids, response) => {
            if (error) console.log(error);
            //ids.ids is the array of ids
            idsList = ids.ids;

            let index = 0;
            let locationList = [];
            const getUsersById = (idsList) => {
                // users/lookup only takes 100 ids at a time as a string of ids separated by commas
                let idsListJoined = idsList.slice(index, index + 100).join(',');
                // if the loop gets to the end of the ids list then idsListJoined will be an empty string "" - falsey.
                if (idsListJoined) {
                    // calls for user objects based on a batch of user ids
                    twitter.get('users/lookup', {
                        user_id: idsListJoined
                    }, (error, users, response) => {
                        _.forEach(users, (user) => {
                            if (user.location) {
                              // push the location on the user object to locationList
                                locationList.push(user.location);
                            }
                        });
                        index += 100;
                        getUsersById(idsList);
                    });
                } else {
                    return;
                }
            };
            getUsersById(idsList);

            function getLocationByQuery(locationList) {
              geocoder.geocode('29 champs elysée paris', function(err, res) {
                if(err) console.log(err);
                console.log(res);
              });
            }
        });




    }
};
