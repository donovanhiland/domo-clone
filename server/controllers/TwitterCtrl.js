import Twitter from 'twitter';
import config from '../config.js';
import _ from 'lodash';
import Promise from 'bluebird';

// Geocoder
let geocoderProvider = 'google';
let httpAdapter = 'https';
let extra = {
    apiKey: config.google.GOOGLE_API_KEY, // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
};
let geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

const twitter = new Twitter({
    consumer_key: config.twitter.TWITTER_CONSUMER_KEY,
    consumer_secret: config.twitter.TWITTER_CONSUMER_SECRET,
    access_token_key: config.twitter.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: config.twitter.TWITTER_ACCESS_TOKEN_SECRET,
});


// The ideas was to use the twitter api to get location of a user's followers.
// Unfortunately twitter api put all kinds of limiters on calling for information.
// I can get 75,000 follower ids every 15 minutes, but only 18,000 user objects with information every 15 minutes.
// This mismatch of numbers makes it hard to do the calls without storing the follower ids somewhere
// To make matters worse, the location on the user object is entered in by the user and not formatted at all. It's not always even there.
// When it is there it's very often formatted different which makes it hard to keep track and tally
// I looked into google's geocoder api to solve this problem. You can query their database with the locations (formatted or not) and it will spit back a formatted address that can be used to tally location for data analysis.
// Unfortunately their api only allows 2500 hits per day. When working with twitter accounts with millions of followers this just doesn't work.
// For now we're going to have to just limit the data selection to 2500 to make things work smoothly. Will look into other solutions in the future.

// The below function is set up to cooperate with the api limits of twitter
// 15 calls every 15 minutes. The max count is 5000, but it can be set to however many ids you want
// It will check to see if there are any more ids left to get and if not will break out, if there are ids left to get and the max calls are reached will wait 15 minutes to start again
// the pagination is tracked by a cursor returned from the api call, which is tracked by the function and stored in cursorTracker

// let limitTracker = 0;
// const getFollowerIds = () => {
//     if (limitTracker === 14 || cursorTracker === 0) {
//         if (limitTracker === 14) {
//             console.log('max tries reached');
//             setTimeout(getFollowerIds(), 96000);
//         }
//         if (cursorTracker === 0) {
//             console.log('finished');
//         }
//         limitTracker = 0;
//         return;
//     }
//     twitter.get('followers/ids', {
//         screen_name: screenName,
//         cursor: cursorTracker,
//         count: 5000
//             // this call can get up to 5000 ids, and can be called 15 times every 15 minutes. 75,000 followers can be retrieved every 15 minutes.
//     }, (error, ids, response) => {
//         if (error) {
//             console.log(error);
//             if (error[0].code === 88) {
//                 // error code 88 is the code sent back from twitter when the limit has been reached
//                 limitTracker = 14;
//             }
//         }
//         let idsList = ids.ids.join(',');
//         cursorTracker = ids.next_cursor;
//         limitTracker++;
//         getFollowerIds();
//     });
// };

module.exports = {
    getDataByScreenName: (screenName) => {

        let idsList;
        let locationData = {};
        let index = 0;
        let locationList = [];
        let locationName;
        let latitude;
        let longitude;
        //call for followers ids
        const getFollowersIdsAsync = (screenName) => {
            return new Promise((resolve, reject) => {
                twitter.get('followers/ids', {
                    screen_name: screenName,
                    count: 20
                }, (error, ids, response) => {
                    if (error) console.log(error);
                    //ids.ids is the array of follower ids
                    idsList = ids.ids;
                    resolve(idsList);
                });
            });
        };

        const getUsersAsync = (idsList) => {
            return new Promise((resolve, reject) => {
                const getUsersById = (idsList) => {
                    // users/lookup only takes 100 ids at a time as a string of ids separated by commas
                    let idsListJoined = idsList.slice(index, index + 100).join(',');
                    if (idsListJoined) {
                        // calls for user objects based on a batch of user ids
                        twitter.get('users/lookup', {
                            user_id: idsListJoined
                        }, (error, users, response) => {
                            _.forEach(users, (user) => {
                                // push the location on the user object to locationList
                                if (user.location) locationList.push(user.location);
                            });
                            index += 100;
                            getUsersById(idsList);
                        });
                    }
                    // if the loop gets to the end of the ids list then idsListJoined will be an empty string "" - falsey.
                    if (!idsListJoined) resolve(locationList);
                };
                // loop through function again until all the ids have been searched
                getUsersById(idsList);
            });
        };

        const getLocationByQueryAsync = (locationList) => {
            return new Promise((resolve, reject) => {
                index = 0;
                const getLocationByQuery = (locationList) => {
                    if (locationList[index]) {
                        geocoder.geocode(locationList[index], function(error, res) {
                            // res is a list of location objects returned based on the queries location
                            if (error) console.log(error);
                            // if response is empty, do nothing. if there is a response, get the level1/2/3long or country property and set locationName equal to that value
                            if (!res[0]) {
                                index++;
                                getLocationByQuery(locationList);
                            }
                            if (res[0]) {
                                // if there's a response, but there's no level1long property
                                if (res[0].administrativeLevels.level1long) {
                                    locationName = res[0].administrativeLevels.level1long;
                                }
                                if (!res[0].administrativeLevels.level1long) {
                                    if (res[0].administrativeLevels.level2long) {
                                        locationName = res[0].administrativeLevels.level2long;
                                    }
                                    if (!res[0].administrativeLevels.level2long) {
                                        if (res[0].administrativeLevels.level3long) {
                                            locationName = res[0].administrativeLevels.level3long;
                                        }
                                        if (!res[0].administrativeLevels.level3long) {
                                            locationName = res[0].country;
                                        }
                                    }
                                }
                                latitude = res[0].latitude;
                                longitude = res[0].longitude;
                            }
                            // if locationData has a property of locationName (which is the state returned from the search), add 1 to the tally
                            if (locationData.hasOwnProperty(locationName)) locationData[locationName].count += 1;
                            // if locationData doesn't have property represented by locationName, create it and start the tally
                            if (!locationData.hasOwnProperty(locationName)) {
                                locationData[locationName] = {
                                    count: 1,
                                    location: {
                                        latitude: latitude,
                                        longitude: longitude
                                    }
                                };
                            }
                            index++;
                            getLocationByQuery(locationList);
                        });
                    }
                    if (!locationList[index]) {
                        resolve(locationData);
                    }
                };
                getLocationByQuery(locationList);
            });
        };

        const handleErr = (error) => {
          console.log('there was an error', error);
        };

        getFollowersIdsAsync(screenName)
            .then(getUsersAsync, handleErr)
            .then(getLocationByQueryAsync, handleErr)
            .then(console.log, handleErr);

    }
};
