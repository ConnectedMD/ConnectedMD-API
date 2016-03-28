var mongoose = require('mongoose');
var uuid = require('node-uuid');
var _ = require("underscore");
var encryption = require('../encryption');
var config = require('../config');


var query = function (params, method) {
    var updatePasswordSchema = require('../schemas/updatePassword');   
    var UpdatePasswordModel = mongoose.model(updatePasswordSchema.Name, updatePasswordSchema.Schema, updatePasswordSchema.CollectionName);
    
    //make sure email does not exist
    return UpdatePasswordModel.findOne({ verifyToken: params.token }).exec().then(function (data) {
        if (!data) { return "{\"error\":\"token does not exist \"}" }
        
        //encrypt password
        params.password = encryption.hash(encryption.encrypt(params.password).content);
       
        return UpdatePasswordModel.update({ password: params.password } , { verifyToken: params.token }).then(function (raw) {
            if (raw) {
                return "{\"passwordUpdated\":\"true\"}";
            }
            return "{\"passwordUpdated\":\"false\"}";
        });
    });

};

module.exports = { query: query }


