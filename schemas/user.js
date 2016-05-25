var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var userSmallSchema = Schema({
	Email : String,
	Firstname : String,
	Lastname : String,
	MobilePhone: Number
});

module.exports = {
	Name: 'user',
	Schema: userSmallSchema,
	CollectionName: 'users'
}
