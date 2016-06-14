"use strict";

var _config = require("../config.js");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = require("twilio")(_config2.default.twilioSID, _config2.default.twilioAuthToken);

module.exports = {
    sendText: function sendText(req, res, next) {
        console.log("sent text message");
        var messages = [];
        for (var i = 0; i < req.body.to.length; i++) {
            client.sendMessage({
                to: req.body.to[i],
                from: req.body.from,
                body: req.body.message
            }, function (err, message) {

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