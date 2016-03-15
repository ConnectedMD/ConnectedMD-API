var mongoose = require('mongoose');
var _ = require("underscore");

var query = function(params, method, session) {
   var encryption = require('../encryption');
   var userSchema = require('../schemas/user');
   var signupSchema = require('../schemas/signup');
   var UserModel = mongoose.model(userSchema.Name, userSchema.Schema, userSchema.CollectionName); 
   var SignupModel = mongoose.model(signupSchema.Name, signupSchema.Schema, signupSchema.CollectionName);
	
	//verify user credentials
	if(!validate(params)){
      return "{\"error\":\"invalid data\"}";
   }
    
	//make sure email does not exist
	return UserModel.find({ email: params.email }).exec().then(function(data) {
      if (data && data.length > 0) { return "{\"error\":\"user with the same email exists \"}" }
      var Q = require("q");
      var deferred = Q.defer();
      //encrypt password
      params.password = encryption.hash(encryption.encrypt(params.password).content);
      //Save the user to the database
      var account = new SignupModel({
         email: params.email,
         firstName: params.firstname,
         lastName: params.lastname,
         password: params.password
      });
      account.save(function (err, data) { deferred.resolve(data); });
      return deferred.promise
         .then(function (results) {
            if(results){
               return "{\"accountCreated\":\"true\"}";
            }
            return "{\"accountCreated\":\"false\"}";
      });
	});

};

function validate(params){
	if(!validateEmail(params.email)){ return false; }
	if(!validateName(params.firstname)){ return false; }
	if(!validateName(params.lastname)){ return false; }
	if(!validatePassword(params.password, params.confirmPassword)){ return false; }
	return true;
}

function validateEmail(email) {
    if (email.length == 0) return false;
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    return regex.test(email);
}

function validateName(name){
    return name !== null && name !== undefined && name !== '';
}

function validatePassword(password, confirmPassword){
	return password !== null && password !== undefined && password === confirmPassword;
}

module.exports = { query: query }


