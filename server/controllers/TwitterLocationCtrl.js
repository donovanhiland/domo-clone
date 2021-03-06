import Twitter from 'twitter';
import TwitterLocation from '../models/TwitterLocation';
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

let idsList,
idsListFiltered,
locationName,
latitude,
longitude,
locationData = {},
index = 0,
locationList = [],
cursorTracker,
ipRegExp = new RegExp('^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');
//call for followers ids
const getFollowersIdsAsync = (screenName, cursor = -1) => {
  return new Promise((resolve, reject) => {
    twitter.get('followers/ids', {
      screen_name: screenName,
      count: 2400,
      cursor: cursor
    }, (error, ids, response) => {
      if (error) console.log(error);
      //ids.ids is the array of follower ids
      idsList = ids.ids;
      idsListFiltered = idsList.filter((id) => {
        if (id.toString().length < 11) return id;
      });
      cursorTracker = ids.next_cursor;
      resolve(idsListFiltered);
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
            if (user.location && !ipRegExp.test(user.location)) locationList.push(user.location);
          });
          index += 100;
          getUsersById(idsList);
        });
      }
      // if the loop gets to the end of the ids list then idsListJoined will be an empty string "" - falsey.
      if (!idsListJoined) {
        resolve(locationList);
      }
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
          if (error) {
            console.log(error);
            console.log(locationList[index]);
            index++;
            getLocationByQuery(locationList);
          }
          // if response is empty, do nothing. if there is a response, get the level1/2/3long or country property and set locationName equal to that value
          // if(res === undefined)
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
            longitude = res[0].longitude;
            latitude = res[0].latitude;
          }
          // if locationData has a property of locationName (which is the state returned from the search), add 1 to the tally
          if (locationData.hasOwnProperty(locationName)) locationData[locationName].count += 1;
          // if locationData doesn't have property represented by locationName, create it and start the tally
          if (!locationData.hasOwnProperty(locationName)) {
            locationData[locationName] = {
              count: 1,
              latitude: latitude,
              longitude: longitude
            };
          }
          index++;
          getLocationByQuery(locationList);
        });
      }
      if (!locationList[index] || index > 2399) {
        locationData.cursorTracker = cursorTracker;
        locationData.date = new Date();
        resolve(locationData);
      }
    };
    getLocationByQuery(locationList);
  });
};

const createLocationDocumentAsync = (locationData) => {
  return new Promise((resolve, reject) => {
    let twitterLocations = {
      data: []
    };
    twitterLocations.date = locationData.date;
    twitterLocations.cursor = locationData.cursorTracker;
    for (let prop in locationData) {
      if (locationData.hasOwnProperty(prop) && prop !== 'date' && prop !== 'cursorTracker') {
        twitterLocations.data.push(locationData[prop]);
      }
    }
    TwitterLocation.create(twitterLocations, (error, response) => {
      if (error) console.log(error);
      resolve(response);
    });
  });
};

const formatLocationDataAsync = (twitterLocations) => {
  return new Promise((resolve, reject) => {
    // TwitterLocation.find({})
    let latitude,
    longitude,
    magnitude,
    color,
    max,
    colorRange = (1 / 11),
    locationJSON = [];
    // webGL globe takes a max magnitude of 8, but to be visible a max magnitude of 4.
    // I need to scale the tally field of followers to between 0 and 4
    // Divide 4 by the max tally to get the magic number I need to scale everything down.
    for (let i = 0; i < twitterLocations.data.length; i++) {
      // find the highest tally so I can use it to scale the others based off of it
      if (max === undefined || max < twitterLocations.data[i].count) max = twitterLocations.data[i].count;
    }
    let scaler = (1 / max);
    for (let i = 0; i < twitterLocations.data.length; i++) {
      // accepted format = [long, lat, mag, color(0 through list of colors defined)]
      if (twitterLocations.data[i] !== 'date' && twitterLocations.data[i] !== 'cursorTracker') {
        longitude = Number(twitterLocations.data[i].longitude.toFixed(3));
        latitude = Number(twitterLocations.data[i].latitude.toFixed(3));
        magnitude = Number((twitterLocations.data[i].count * scaler).toFixed(3));
        if (magnitude >= colorRange * 0 && magnitude <= colorRange * 1) color = 0;
        if (magnitude >= colorRange * 1 && magnitude <= colorRange * 2) color = 1;
        if (magnitude >= colorRange * 2 && magnitude <= colorRange * 3) color = 2;
        if (magnitude >= colorRange * 3 && magnitude <= colorRange * 4) color = 3;
        if (magnitude >= colorRange * 4 && magnitude <= colorRange * 5) color = 4;
        if (magnitude >= colorRange * 5 && magnitude <= colorRange * 6) color = 5;
        if (magnitude >= colorRange * 6 && magnitude <= colorRange * 7) color = 6;
        if (magnitude >= colorRange * 7 && magnitude <= colorRange * 8) color = 7;
        if (magnitude >= colorRange * 8 && magnitude <= colorRange * 9) color = 8;
        if (magnitude >= colorRange * 9 && magnitude <= colorRange * 10) color = 9;
        if (magnitude >= colorRange * 10 && magnitude <= colorRange * 11) color = 10;
        locationJSON.push(latitude, longitude, magnitude, color);
      }
    }
    resolve(locationJSON);
  });
};

const handleErr = (error) => {
  console.log('there was an error', error);
};

module.exports = {
    getDataByScreenName: (req, res, next) => {
        getFollowersIdsAsync(req.body.screenName)
            .then(getUsersAsync, handleErr)
            .then(getLocationByQueryAsync, handleErr)
            .then(createLocationDocumentAsync, handleErr)
            .then(formatLocationDataAsync, handleErr)
            .then((response) => {
                res.status(200).json(response);
            });
    },

    formatLocationDataFromDB: (req, res, next) => {
      TwitterLocation.findOne(req.body, (error, response) => {
        console.log(response);
        formatLocationDataAsync(response)
        .then((response) => {
          res.status(200).send(response);
        });
      });
    }
};
