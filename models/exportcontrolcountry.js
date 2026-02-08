const mongoose = require('mongoose');
// Define collection and schema
let ExportcontrolcountrySchema = new mongoose.Schema({
   cname: { type: String }
})
module.exports = mongoose.model('Exportcontrolcountry', ExportcontrolcountrySchema)
