'use strict';

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _config = require('../config.js');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EMAIL_ACCOUNT_USER = _config2.default.emailAccountUser;
var EMAIL_ACCOUNT_PASSWORD = _config2.default.emailPassword;
var YOUR_NAME = _config2.default.emailName;

var smtpTransport = _nodemailer2.default.createTransport("SMTP", {
  service: "Gmail", // sets automatically host, port and connection security settings
  auth: {
    user: EMAIL_ACCOUNT_USER,
    pass: EMAIL_ACCOUNT_PASSWORD
  }
});
module.exports = {

  sendEmail: function sendEmail(req, res, next) {
    smtpTransport.sendMail({ //email options
      from: "Domo Clone <domoclone@gmail.com>", // sender address.  Must be the same as authenticated user if using GMail.
      to: req.body.toField, // receiver
      subject: req.body.subjectField, // subject
      text: req.body.textField // body
    }, function (error, response) {
      //callback
      if (error) {
        console.log(error);
      } else {
        console.log("Message sent: " + response.message);
        res.send("email sent");
      }

      smtpTransport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
    });
  }
};