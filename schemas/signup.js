var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var signupSchema = Schema({
    email : String,
    companyId: Schema.Types.ObjectId,
	firstName : String,
	lastName : String,
	password: String,
	confirmPassword: String,
   sharedCompanyIds:[]
});

module.exports = {
	Name: 'signup',
	Schema: signupSchema,
	CollectionName: 'users'
}
