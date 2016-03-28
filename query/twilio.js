var mongoose = require('mongoose');
var twilio = require('twilio');
var config = require('./config');
//-- REF: https://www.twilio.com/blog/2013/03/introducing-the-twilio-module-for-node-js.html
var accountSid = config.twilio.accountSid; 
var authToken = config.twilio.authToken;
var twilioNumber = config.twilio.twilioNumber; 
var client = new twilio.RestClient(accountSid, authToken);

var query = function(params, method, session) {  
	if(method === "POST") {
		if (params.action == "sms") {
         var Q = require("q");
         var deferred = Q.defer();
			client.sms.messages.create({
				to:params.number,
				from:twilioNumber,
				body:params.message
			}, function(error, message) {
				if (error) {
					console.log("error", error);
					deferred.resolve("fail");
				} else {
					console.log("SMS Sent",message.dateCreated,"SID for this SMS message", message.sid);
					deferred.resolve("success");
				}
			});
			return deferred.promise.then(function (results) {
				return "{\"sms\":\"" + results + "\"}";
			});

		} else if (params.action="xxx") {
			var userProfileSchema = require('../schemas/userProfile');
			var userProfileModel = mongoose.model(userProfileSchema.Name, userProfileSchema.Schema, userProfileSchema.CollectionName); 
			var queryBuilder = {};
			if(session.userId)	{ 
				queryBuilder._id = mongoose.Types.ObjectId(session.userId); 
			} else {
				return "{\"error\":\"user not logged in\"}";
			}
			var query =  userProfileModel.findOne(queryBuilder, { password: 0, _id: 0 });
			return query.exec(function (err, data) {
				if (err) throw err;
				return data && data.length > 0 ? data.toObject() : null;
			})
			.then(function(result){
				return JSON.stringify(result);
			});
		} else {
			return "{\"error\":\"unsupported request\"}";
		}
	}
}

module.exports = {
    query: query
}
