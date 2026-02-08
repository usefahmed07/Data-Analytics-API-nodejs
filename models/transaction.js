const mongoose = require('mongoose');
// Define collection and schema

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
let TransactionSchema = new Schema({
   _id:{type:ObjectId},
   status: {type: String},
   email: { type: String },
   lei: { type: String },
   name: { type: String },
   checkDate: { type: String },
   wallet: { type: String   },
   country: {  type: String },
   date: { type: String },
   order:{type: Array }
})
module.exports = mongoose.model('Transaction', TransactionSchema)
