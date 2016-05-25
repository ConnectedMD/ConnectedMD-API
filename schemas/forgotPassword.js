var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var forgotPasswordSchema = Schema({
	email : { type: String },
	token: { type: String },
	firstName : String,
    lastName : String,
    verifyToken: String
});

module.exports = {
	Name: 'forgotPassword',
	Schema: forgotPasswordSchema,
	CollectionName: 'users'
}