import Twitter from 'twitter';
import config from '../config.js';

let twitter = new Twitter({
    consumer_key: config.twitter.TWITTER_CONSUMER_KEY,
    consumer_secret: config.twitter.TWITTER_CONSUMER_SECRET,
    access_token_key: config.twitter.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: config.twitter.TWITTER_ACCESS_TOKEN_SECRET,
});

module.exports = {

    getDataByScreenName: (screenName) => {
        //=== gets followers ids from screen name ===//
        twitter.get('followers/ids', {
            screen_name: screenName,
            count: 20
                // this call can get up to 5000 ids, and can be called 15 times every 15 minutes. 75,000 followers can be retrieved every 15 minutes.
        }, (error, ids, response) => {
            // error is the error message
            // ids is the json response with ids
            // response is the full raw response object
            if (error) console.log(error);
            let idsList = ids.ids.join(',');
            console.log(idsList);

            //=== gets users by user id ===//
            twitter.get('users/lookup', {
                user_id: idsList
                    // this call can be passed a maximum of 100 user ids at a time. With user auth the endpoint can be hit 180 times every 15 minutes: 18,000 users every 15 minutes. With app auth the endpoint can be hit 60 times every 15 minutes: 6000 users every 15 minutes.
            }, (error, user, response) => {
                if (error) console.log(error);
                let trimmedArray = [];
                for(let i = 0; i < user.length; i++) {
                  if(user[i].location) {
                    trimmedArray.push(user[i].location);
                  }
                }
                for (let i = 0; i < trimmedArray.length; i++) {
                    console.log(trimmedArray[i]);
                }
            });
        });
    }

};
