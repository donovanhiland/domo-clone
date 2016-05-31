  var User = require('../models/UserModel');

  module.exports = {

      register: function(req, res, next) {
          // save user information on signup
          User.create(req.body, function(err, dbRes) {
              if (err) {
                  res.status(500).json(err);
              } else {
                  console.log('account creation successful');
                  res.json(dbRes);
              }
          });
      },

      checkAuth: function(req, res, next) {
          if (req.user) {
              res.status(200).json(req.user.type);
          }
          if (!req.user) {
              res.status(200).json('unauthorized');
          }
      },

      getUsers: function(req, res, next) {
          User.find(req.query, function(err, result) {
              if (err) return res.status(500).send(err);
              for (var i = 0; i < result.length; i++) {
                  delete result[i].password;
              }
              res.status(200).send(result);
          });
      },

      me: function(req, res, next) {
          if (!req.user) return res.status(401).send('current user not defined');
          var info = req.user.toObject();
          delete info.password;
          return res.status(200).json(info);
      },

      update: function(req, res, next) {
          User.findByIdAndUpdate(req.params._id, req.body, function(err, result) {
              if (err) next(err);
              else {
                  result.password = req.body.password;
                  result.save(function(err, result) {
                      if (err) next(err);
                      else res.status(200).send('user updated');
                  })
              }
          });
      },

      logout: function(req, res, next) {
          // user logout
          req.logout();
          return res.status(200).json('logged out');
      }


  };
