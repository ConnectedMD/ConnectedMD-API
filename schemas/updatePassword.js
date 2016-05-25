var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var updatePasswordSchema = Schema({
    password : { type: String },
    verifyToken: { type: String }
});

module.exports = {
    Name: 'updatePassword',
    Schema: updatePasswordSchema,
    CollectionName: 'users'
}