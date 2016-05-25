var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var userProfileSchema = Schema({
   _id: Schema.Types.ObjectId,
   email : String,
   firstName : String,
   middleName : String,
   lastName : String,
   hireDate: Date,
   birthDate: Date,
   gender: String,
   photo: String,
   createDate: Date,
   mobile: String,
   contact: {
      address: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      phoneNumber: String,
      email: String
   },
   work:{
      workLocation: String,
      jobTitle: String,
      payType: String,
      flsaStatus : String,
      workCompCode: String,
      eeoCode: String,
      department: String,
      companyRole: String,
      status: String
   },
   emergencyContact: {
      firstName: String,
      lastName: String,
      relationship: String,
      phoneNumber: String,
      email: String,
      address: String
   },
   sharedCompanyIds: []
});

module.exports = {
    Name: 'userProfile',
    Schema: userProfileSchema,
    CollectionName: 'users'
}
