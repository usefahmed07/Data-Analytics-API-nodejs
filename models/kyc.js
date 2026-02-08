const mongoose = require('mongoose');
// Define collection and schema
let KYCSchema = new mongoose.Schema({
   status: {type: String},
   email: { type: String },
   lei: { type: String },
   name: { type: String },
   checkDate: { type: String },
   wallet: { type: String   },
   country: {  type: String },
   date: { type: String }
})
module.exports = mongoose.model('Kyc', KYCSchema)
