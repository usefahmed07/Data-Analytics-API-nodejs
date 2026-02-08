const mongoose = require('mongoose');
// Define collection and schema

let LogSchema = new mongoose.Schema({
   lei: { type: String },
   pastRecord: { type: String },
   currentRecord: { type: String },
   dateVerified: { type: String },
   wallet: {  type: String }
})
module.exports = mongoose.model('Log', LogSchema)
