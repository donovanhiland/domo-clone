import config from '../config.js';
var client = require("twilio")(config.twilioSID, config.twilioAuthToken);


module.exports = {
  sendText: function(req, res, next) {
      console.log("sent text message");
      var messages = [];
      for (var i = 0; i < req.body.to.length; i++) {
          client.sendMessage({
              to: req.body.to[i],
              from: req.body.from,
              body: req.body.message
          }, function(err, message) {

              if (err) {
                  res.send(err);
              } else {
                  messages.push(message);

              }
          });
      }
      res.send("messages sent");
  }
};
