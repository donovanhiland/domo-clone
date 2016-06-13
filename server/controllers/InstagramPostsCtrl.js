// The original plan was to use Instagram's api to get data on users/followers/posts.
// It turns out that authorizing Instagram only lets you view information on the user that's authorized.
// For our purposes we need to be able to see other users when authorizing so this didn't work out.

// let ig = require('instagram-node').instagram();
// import config from '../config.js';
//
// ig.use({
//     client_id: config.instagram.INSTAGRAM_CLIENT_ID,
//     client_secret: config.instagram.INSTAGRAM_CLIENT_SECRET
//     // access_token: config.instagram.INSTAGRAM_ACCESS_TOKEN
// });
//
// let redirect_uri = config.instagram.INSTAGRAM_REDIRECT_URI;
//
// module.exports = {
//
//     authorize_user: function(req, res) {
//         res.redirect(ig.get_authorization_url(redirect_uri, {
//             scope: ['public_content'],
//             state: 'a state'
//         }));
//     },
//
//     handleauth: function(req, res) {
//         ig.authorize_user(req.query.code, redirect_uri, function(err, result) {
//             if (err) {
//                 console.log(err.body);
//                 res.send("Didn't work");
//             } else {
//               accesstoken = result.access_token;
//                 console.log('Yay! Access token is ' + result.access_token);
//                 res.redirect('/#/dashboard/overview');
//             }
//         });
//     },
//
//     aggregateInstaPosts: (req, res, next) => {
//         ig.use({
//           access_token: config.access_token.INSTAGRAM_ACCESS_TOKEN
//         });
//
//         // ig.user_search('devmountain', function(err, users, remaining, limit) {
//         //     if (err) console.log(err);
//         //     console.log(err, users, remaining, limit);
//         // });
//         /* OPTIONS: { [count], [min_timestamp], [max_timestamp], [min_id], [max_id] }; */
//         ig.user_media_recent('229412207', (err, medias, pagination, remaining, limit) => {
//           if(err) console.log(err);
//           console.log(medias, pagination, remaining, limit);
//         });
//     }
//
// };
