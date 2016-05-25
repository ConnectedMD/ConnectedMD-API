var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var login = Schema({
	_id : ObjectId,
	email : String,
	password : String,
	firstName : String,
	lastName : String
});

module.exports = {
	Name: 'login',
	Schema: login
}