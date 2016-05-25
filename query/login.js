var mongoose = require('mongoose');
var uuid = require('node-uuid');
var crypto = require('crypto');
var _ = require("underscore");

var query = function(credentials, method, session) {
    var querySchema = require('../schemas/login');
    var query = mongoose.model("users", querySchema.Schema, "users"); 
    var returnJSON = "";
    if (credentials.password == "password") {
      return "{\"token\":\"\", \"error\":\"Password invalid\"}";
    } else {
      //-- show password in console
      console.log(credentials.email + " encrypted password is " + hash(encrypt(credentials.password).content));
      //-- authenticate user
      return query.findOne({ email : credentials.email }, function (err, data) {
         if (credentials.email.length > 3 && credentials.password.length > 3) {
               if (err || data === null) {
                  console.log(err, data);
                  returnJSON = "{\"token\":\"\", \"error\":\"User not found\"}";
               } else {
                  var password = hash(encrypt(credentials.password).content);
                  if (data.email == credentials.email && data.password == password) {
                     var session = _.find(sessions, {email: data.email });
                     var token = null;
                     if (session === undefined) {
                           token = uuid.v4();
                           sessions.push({token: token, userId: data._id, email: data.email, firstName: data.firstName, lastName: data.lastName });
                           console.log("\x1b[1;45m New Session \x1b[0m " + token + " for " + data.email);
                     } else {
                           token = session.token;
                           console.log("\x1b[1;46m Existing Session \x1b[0m " + token + " for " + data.email);
                     }
                     returnJSON = "{\"token\":\"" + token + "\"}";
                  } else {
                     returnJSON = "{\"token\": \"\",\"error\":\"Invalid email or password\"}";
                  }
                  
               }
         } else {
               returnJSON = "{\"token\": \"\",\"error\":\"user or password length too short\"}";
         }
      })
      .then(function(data) { 
         return returnJSON;
      });
    }    
};

function hash(text) {
    return crypto.createHmac("md5", "0u812").update(text).digest("hex");
}

function encrypt(text) {
  var cipher = crypto.createCipheriv("aes-256-gcm", "3zTvzr3p67VC61jmV54rIYu1545x4TlY", "60iP0h6vJoEa")
  var encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex');
  var tag = cipher.getAuthTag();
  return {
    content: encrypted,
    tag: tag
  };
}

function decrypt(encrypted) {
  var decipher = crypto.createDecipheriv("aes-256-gcm", "3zTvzr3p67VC61jmV54rIYu1545x4TlY", "60iP0h6vJoEa")
  decipher.setAuthTag(encrypted.tag);
  var dec = decipher.update(encrypted.content, 'hex', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}

module.exports = { query: query }


