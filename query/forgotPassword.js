var mongoose = require('mongoose');
var config = require('../config');
var uuid = require('node-uuid');
var _ = require("underscore");

var query = function(params, method, session) {
   var forgotPasswordSchema = require('../schemas/forgotPassword');
   var ForgotPasswordModel = mongoose.model(forgotPasswordSchema.Name, forgotPasswordSchema.Schema, forgotPasswordSchema.CollectionName); 
   //verify user credentials
   if(!validateEmail(params.email)) { return "{\"error\":\"invalid email\"}"; }
   //make sure email does not exist
   return ForgotPasswordModel.findOne({ email: params.email }).exec().then(function(data) {
      if(!data){ return "{\"error\":\"email does not exist \"}" }
      //Generate token and save it to db
      var token = uuid.v4();
      ForgotPasswordModel.update({ email: params.email } ,{ verifyToken: token }).then(function(raw) {
         //Get the template
         var fs = require('fs');
         var templateUrl = config.email.templates.forgotPassword;
         var htmlTemplate = fs.readFileSync(templateUrl, "utf8");
         var url = 'http://app.connected.md/?token=' + token;    //hardcoded url to test (for now)
         //read template and replace placeholders
         htmlTemplate = htmlTemplate.replace('{{user}}', data.firstName + ' ' + data.lastName).replace('{{appUrl}}', url);
         var nodemailer = require('nodemailer');
         var transporter = nodemailer.createTransport({
            host: config.email.host,
            port: config.email.port,
            secure: config.email.enableSSL,
            auth: {
               user: config.email.username,
               pass: config.email.password
            }
         });
         //email data
         var mailOptions = {
            from: config.email.fromEmail,
            to: data.email,
            subject: 'Reset Password',
            html: htmlTemplate
         };
         transporter.sendMail(mailOptions, function(error, info) {
            if(error) throw error;
            return "{\"emailSent\":\"true\"}";
         });
      });
   });
};

function validateEmail(email) {
   if (email.length == 0) return false;
   var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
   return regex.test(email);
}

module.exports = { query: query }


