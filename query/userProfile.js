var mongoose = require('mongoose');

var query = function(params, method, session) {  
   var userProfileSchema = require('../schemas/userProfile');
   var userProfileModel = mongoose.model(userProfileSchema.Name, userProfileSchema.Schema, userProfileSchema.CollectionName); 

   if (method === "POST") {
      if (!session.companyId) {
         return "{\"error\":\"user not logged in\"}";
      }
      var record;
      var queryBuilder = {};
      if (params.action == "currentUser") {
         if (params.userId !== null && params.userId !== undefined) {
            queryBuilder._id = mongoose.Types.ObjectId(params.userId);
         } else {
            queryBuilder._id = mongoose.Types.ObjectId(session.userId);
         }
         var query =  userProfileModel.findOne(queryBuilder, { password: 0});
         return query.exec(function (err, data) {
            if (err) throw err;
            return data && data.length > 0 ? data.toObject() : null;
         })
         .then(function(result) {
            return JSON.stringify(result);
         });
      } else if (params.action == "allUsers") {
         queryBuilder.sharedCompanyIds = mongoose.Types.ObjectId(session.companyId);
         var query = userProfileModel.find(queryBuilder);
         return query.exec(function (err, data) {
            if (err) { console.log("allUsers",err); return JSON.stringify(err); };
         })
         .then(function(result) {
            return JSON.stringify(result);
         });
      }
   } else if (method === "PUT") {
      if(!session.companyId) {
         return "{\"error\":\"user not logged in\"}";
      }
      var conditions = {}
      conditions._id = mongoose.Types.ObjectId(params._id);
      var upsertData = {};
      var response;
      /* update data - this might not be necessary - one could just pass the object to the query directly */
      if(params.email){ upsertData.email = params.email }
      if(params.firstName){ upsertData.firstName = params.firstName }
      if(params.middleName){ upsertData.middleName = params.middleName }
      if(params.lastName){ upsertData.lastName = params.lastName }
      if(params.birthDate){ upsertData.birthDate = params.birthDate }
      if(params.gender){ upsertData.gender = params.gender }
      if(params.mobile){ upsertData.mobile = params.mobile }
      if(params.photo){ upsertData.photo = params.photo }
      if(params.createDate){ upsertData.createDate = params.createDate }
      if(params.contact) {
         upsertData.contact = {};
         if(params.contact.address){ upsertData.contact.address = params.contact.address }
         if(params.contact.city){ upsertData.contact.city = params.contact.city }
         if(params.contact.state){ upsertData.contact.state = params.contact.state }
         if(params.contact.postalCode){ upsertData.contact.postalCode = params.contact.postalCode }
         if(params.contact.country){ upsertData.contact.country = params.contact.country }
         if(params.contact.phoneNumber){ upsertData.contact.phoneNumber = params.contact.phoneNumber }
         if(params.contact.email){ upsertData.contact.email = params.contact.email }
      }
      if(params.emergencyContact){ 
         upsertData.emergencyContact = {};
         if(params.emergencyContact.firstName){ upsertData.emergencyContact.firstName = params.emergencyContact.firstName}
         if(params.emergencyContact.lastName){ upsertData.emergencyContact.lastName = params.emergencyContact.lastName}
         if(params.emergencyContact.relationship){ upsertData.emergencyContact.relationship = params.emergencyContact.relationship}
         if(params.emergencyContact.phoneNumber){ upsertData.emergencyContact.phoneNumber = params.emergencyContact.phoneNumber}
         if(params.emergencyContact.email){ upsertData.emergencyContact.email = params.emergencyContact.email}
         if(params.emergencyContact.address){ upsertData.emergencyContact.address = params.emergencyContact.address}
      }
      var Q = require("q");
      var deferred = Q.defer();
      userProfileModel.update(conditions, upsertData, { upsert: false }, function(err, raw) {
         if(err) { deferred.reject(); }
         response = raw;
         deferred.resolve(response);
      });
      return deferred.promise.then(function (results) {
         if(results) {
            return "{\"updated\":\"true\"}";
         } else {
            return "{\"error\":\"could not update record\"}";
         }               
      });
   } else if (method == "DELETE") {
      if(!session.companyId) {
         return "{\"error\":\"user not logged in\"}";
      }
      var conditions = {}
      conditions._id = mongoose.Types.ObjectId(params._id);
      var response;
      return userProfileModel.remove(conditions, function(err, removed) {
         response = removed;
      })
      .then(function() {
         if(response) return "{\"updated\":\"true\"}";
         return "{\"error\":\"could not update user profile\"}";
      })   
   } else {
      return "{\"error\":\"unsupported request\"}";
   }
}

module.exports = {
    query: query
}
