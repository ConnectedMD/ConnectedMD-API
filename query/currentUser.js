var mongoose = require('mongoose');
var query = function(params, method, session){  
    if(method === "POST"){
        var userProfileSchema = require('../schemas/userProfile');
        var userProfileModel = mongoose.model(userProfileSchema.Name, userProfileSchema.Schema, userProfileSchema.CollectionName); 
        var queryBuilder = {};
        if(session.userId){ 
            queryBuilder._id = mongoose.Types.ObjectId(session.userId) 
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

module.exports = {
    query: query
}
