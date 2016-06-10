let ig = require('instagram-node').instagram();
import config from '../config.js';

console.log(config.instagram.INSTAGRAM_ACCESS_TOKEN);

module.exports = {

    aggregateInstaPosts: (req, res, next) => {
        ig.use({
            access_token: config.instagram.INSTAGRAM_ACCESS_TOKEN
        });
        ig.user_search('devmtn', function(err, users, remaining, limit) {
          if(err) console.log(err);
            console.log(users);
        });
        /* OPTIONS: { [count], [min_timestamp], [max_timestamp], [min_id], [max_id] }; */
        // ig.user_media_recent('devmtn', (err, medias, pagination, remaining, limit) => {
        //   console.log(medias, pagination, remaining, limit);
        // });
    }

};
