import nodemailer from 'nodemailer';
import config from '../config.js'


var EMAIL_ACCOUNT_USER = config.emailAccountUser;
var EMAIL_ACCOUNT_PASSWORD = config.emailPassword;
var YOUR_NAME = config.emailName;


var smtpTransport = nodemailer.createTransport("SMTP",{
  service: "Gmail",  // sets automatically host, port and connection security settings
  auth: {
    user: EMAIL_ACCOUNT_USER,
    pass: EMAIL_ACCOUNT_PASSWORD
  }
});
module.exports = {

    sendEmail: function(req, res, next) {
      smtpTransport.sendMail({  //email options
        from: "Domo Clone <domoclone@gmail.com>", // sender address.  Must be the same as authenticated user if using GMail.
        to: req.body.toField, // receiver
        subject: req.body.subjectField, // subject
        text: req.body.textField // body
      }, function(error, response){  //callback
        if(error){
          console.log(error);
        }else{
          console.log("Message sent: " + response.message);
          res.send("email sent");
        }

        smtpTransport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
      });
    }
};
