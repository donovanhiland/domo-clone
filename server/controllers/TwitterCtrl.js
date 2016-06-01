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
        let cursorTracker = -1;
        let limitTracker = 0;
        let farmUserIds = setInterval(() => { //this set interval doesn't work because it when the interval is set to 15 minutes, I think it waits 15 minutes to run it the first time.
            if (cursorTracker === 0) {
                clearInterval(farmUserIds);
            }
            let getFollowerIds = () => {
                if (limitTracker === 14 || cursorTracker === 0) {
                    if (limitTracker === 14) {
                        console.log('max tries reached');
                    }
                    if (cursorTracker === 0) {
                        console.log('finished');
                    }
                    limitTracker = 0;
                    return;
                }
                twitter.get('followers/ids', {
                    screen_name: screenName,
                    cursor: cursorTracker,
                    count: 5000
                        // this call can get up to 5000 ids, and can be called 15 times every 15 minutes. 75,000 followers can be retrieved every 15 minutes.
                }, (error, ids, response) => {
                    if (error) {
                        console.log(error);
                        if (error[0].code === 88) {
                            limitTracker = 14;
                        }
                    }
                    let idsList = ids.ids.join(',');
                    cursorTracker = ids.next_cursor;
                    limitTracker++;
                    console.log(idsList);
                    console.log(cursorTracker);
                    getFollowerIds();
                });
            };
            getFollowerIds();
        }, 100 /*16 minute buffer to make sure it's long enough before another request*/ );

        //=== gets users by user id ===//
        // twitter.get('users/lookup', {
        //     user_id: idsListg
        //         // this call can be passed a maximum of 100 user ids at a time. With user auth the endpoint can be hit 180 times every 15 minutes: 18,000 users every 15 minutes. With app auth the endpoint can be hit 60 times every 15 minutes: 6000 users every 15 minutes.
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
    }

};
