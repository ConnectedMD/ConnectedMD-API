var mongoose = require('mongoose');

var query = function(params, callback){
	var userSchema = require('../schemas/user');
	var User = mongoose.model(userSchema.Name, userSchema.Schema); 
	
	//authenticate user
	User.find().where( '_id', params.id ).exec(function(data){
		callback(data || {});
	});
}

module.exports = {
	query: query
}