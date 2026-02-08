const mongoose = require('mongoose');
// Define collection and schema

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
let HistoricalTransactionSchema = new Schema({
   _id:{type:ObjectId},
    TransactionId:{type: String},
    TransactionType:{type: String},
    OriginalAmount:{type: String},
    CurrencyCode:{type: String},
    ConvertedAmount:{type: String},
    TransactionStatus: {type: String},
    TransactionCategoryId: {type: Number},
    TransactionClassificationId:{type: String},
    PredictedMerchantName: {type: String},
    nameOrig:{type: String},
    leiOrig:{type: String},
    nameDest:{type: String},
    leiDest: {type: String},
    consigneeLocation:{type: String},
    isFraud:{type: String} ,
    isFlaggedFraud: {type: String},
    AnomalyIndicators:{type: String},
    leiShipper:{type: String},
  
})
module.exports = mongoose.model('HistoricalTransaction', HistoricalTransactionSchema)
