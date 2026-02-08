const express = require('express');
const KYCModel = require('../models/kyc');
const TransactionModel = require('../models/transaction');
const HistoricalTransactionModel = require('../models/historicaltransaction');
const ExportControlModel = require('../models/exportcontrolcountry');
const LogModel = require('../models/log')
const OrderModel = require('../models/order')
const router = express.Router();
const https = require('https');
const mongoose = require('mongoose');

const countries=[];
// const countries = ["NORTH KOREA", "CUBA", "SOUTH KOREA"]

router.get('/', async (req, res) => {
res.json('Hello Data Analytics API')
})
//Post Method
router.post('/post', async (req, res) => {
    console.log(req)
    const data = new ExportControlModel({
        cname: req.body.cname,
        })
    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})
    router.post('/postInfo', async (req, res) => {
    console.log(req.body)
    // console.log(req.params.cname)
    console.log(req.body)
    const data = new KYCModel(req.body)
    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})
async function httpGet(LEINo) {
    return new Promise((resolve, reject) => {
        // const url  =  "https://api.gleif.org/api/v1/lei-records?page[size]=10&page[number]=1&filter[lei]="+LEINo;  
        const url  = "https://api.gleif.org/api/v1/lei-records?filter[lei]="+LEINo;
        
            https.get(url, result => {
                let data = '';
                result.on('data', chunk => {
                  data += chunk;
                });
                result.on('end', () => {
                    resolve(JSON.parse(data))
            })
          }).on('error', err => {
            console.log(err.message);
          })
    });
}
async function saveLog(logArray){
    console.log('logArray')
// //         console.log(logArray)
// var LogJSON = JSON.stringify(logArray);
//     console.log(LogJSON)
    for (var i=0;i< logArray.length;i++)
        {
            const dataToSave = logArray[i]
        const logdata = new LogModel(dataToSave)
        try {
            const logdataToSave = await logdata.save()
            console.log('Log saved')
// res.status(200).json(logdataToSave)
        }
        catch (error) {
            console.log(error.message)
            // res.status(400).json({ message: error.message })
        }
        }
}
//Get all from KYC Collection Method
router.get('/kyc', async (req, res) => {
    let leiArray = new Array();
    let finalLEIRecord = [];
    let logArray = new Array();
    let logRecord = [];

    try {
        const data = await KYCModel.find();
        console.log(data)
        for(var i=0;i<data.length;i++){
            console.log(data[i].lei)
            const LEINo = data[i].lei;
            const name =  data[i].name;
            const email = data[i].email;
            const wallet = data[i].wallet;
            const kycregDate = data[i].date;
            const currentDate = new Date();
            const mongo_id = data[i]._id
            const lei_db_status= data[i].status

           if(LEINo === ''){
            //Missing LEI in KYC Collection
            console.log('MISSING LEI INFO in KYC Collection')
           }
           else{ //LEI Available in KYC Collection
            //GLEIF LEI Verification - Check if lei records Available
            const parsedata = await httpGet(LEINo);
       
                  console.log('Data Fetched from GLEIF API');
                    // console.log(parsedata);
                  if(parsedata.data.length != 0 ){ 
                    //console.log(data);
                    //Check with lei status
                    const GLEIF_LEIStatus = parsedata.data[0].attributes.entity.status;
                    // const GLEIF_Address = parsedata.data[0].attributes.entity.legalAddress;
                    const GLEIF_Address = parsedata.data[0].attributes.entity.legalAddress.addressLines[0];
                    const cityName = parsedata.data[0].attributes.entity.legalAddress.city;
                    const GLEIFpostalCode = parsedata.data[0].attributes.entity.legalAddress.postalCode;
                    const GLEIFcountry = parsedata.data[0].attributes.entity.legalAddress.country;
                    console.log(GLEIF_LEIStatus);
                    finalLEIRecord = {"status":GLEIF_LEIStatus,"lei":LEINo ,"name":name, "email": email,"wallet":wallet,"kycreg":kycregDate,"checkDate":currentDate,"mongoID":mongo_id,"legalAddress":GLEIF_Address,"city":cityName,"postalCode":GLEIFpostalCode,"GLEIFcountry":GLEIFcountry}
                    leiArray.push(finalLEIRecord)
                    logRecord ={"lei":LEINo,"pastRecord":lei_db_status,"currentRecord":GLEIF_LEIStatus,"dateVerified":currentDate,"wallet":"Get Wallet address here"}
                    logArray.push(logRecord)
                  }
                  else{
                    console.log('NO RECORDS FOUND');
                    finalLEIRecord = {"status":"NO RECORDS AVAILABLE","lei":LEINo ,"name":name, "email": email,"wallet":wallet,"kycreg":kycregDate,"checkDate":currentDate,"mongoID":mongo_id,"legalAddress":'Not Available',"city":'NA',"postalCode":'NA',"GLEIFcountry":'NA'}
                    leiArray.push(finalLEIRecord)
                    logRecord ={"lei":LEINo,"pastRecord":lei_db_status,"currentRecord":"No Records in GLEIF","dateVerified":currentDate,"wallet":"Get Wallet address here"}
                    logArray.push(logRecord)                
                  }
           }
        }
        
        //save logs to mongo
        const logsaved = await saveLog(logArray)
        res.json(leiArray);
        
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
//Get all from KYC Collection Method
router.get('/kyc/:walletAddress', async (req, res) => {
    let leiArray = new Array();
    let finalLEIRecord = [];
    let logArray = new Array();
    let logRecord = [];
    let metamaskAddress = req.params.walletAddress;
    try {
        const data = await KYCModel.find();
        console.log(data)
        for(var i=0;i<data.length;i++){
            console.log(data[i].lei)
            const LEINo = data[i].lei;
            const name =  data[i].name;
            const email = data[i].email;
            const wallet = data[i].wallet;
            const kycregDate = data[i].date;
            const currentDate = new Date();
            const mongo_id = data[i]._id
            const lei_db_status= data[i].status

           if(LEINo === ''){
            //Missing LEI in KYC Collection
            console.log('MISSING LEI INFO in KYC Collection')
           }
           else{ //LEI Available in KYC Collection
            //GLEIF LEI Verification - Check if lei records Available
            const parsedata = await httpGet(LEINo);
       
                  console.log('Data Fetched from GLEIF API');
                    // console.log(parsedata);
                  if(parsedata.data.length != 0 ){ 
                    //console.log(data);
                    //Check with lei status
                    const GLEIF_LEIStatus = parsedata.data[0].attributes.entity.status;
                    // const GLEIF_Address = parsedata.data[0].attributes.entity.legalAddress;
                    const GLEIF_Address = parsedata.data[0].attributes.entity.legalAddress.addressLines[0];
                    const cityName = parsedata.data[0].attributes.entity.legalAddress.city;
                    const GLEIFpostalCode = parsedata.data[0].attributes.entity.legalAddress.postalCode;
                    const GLEIFcountry = parsedata.data[0].attributes.entity.legalAddress.country;
                    console.log(GLEIF_LEIStatus);
                    finalLEIRecord = {"status":GLEIF_LEIStatus,"lei":LEINo ,"name":name, "email": email,"wallet":wallet,"kycreg":kycregDate,"checkDate":currentDate,"mongoID":mongo_id,"legalAddress":GLEIF_Address,"city":cityName,"postalCode":GLEIFpostalCode,"GLEIFcountry":GLEIFcountry}
                    leiArray.push(finalLEIRecord)
                    logRecord ={"lei":LEINo,"pastRecord":lei_db_status,"currentRecord":GLEIF_LEIStatus,"dateVerified":currentDate,"wallet":metamaskAddress}
                    logArray.push(logRecord)
                  }
                  else{
                    console.log('NO RECORDS FOUND');
                    finalLEIRecord = {"status":"NO RECORDS AVAILABLE","lei":LEINo ,"name":name, "email": email,"wallet":wallet,"kycreg":kycregDate,"checkDate":currentDate,"mongoID":mongo_id,"legalAddress":'Not Available',"city":'NA',"postalCode":'NA',"GLEIFcountry":'NA'}
                    leiArray.push(finalLEIRecord)
                    logRecord ={"lei":LEINo,"pastRecord":lei_db_status,"currentRecord":"No Records in GLEIF","dateVerified":currentDate,"wallet":metamaskAddress}
                    logArray.push(logRecord)                
                  }
           }
        }
        
        //save logs to mongo
        const logsaved = await saveLog(logArray)
        res.json(leiArray);
        
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/getTransactions', async (req, res) => {
    let transArray = new Array();
    let finalTransactionRecord = [];

    try {
        // const transactiondata = await TransactionModel.find();
        // console.log(transactiondata)
        const ecc = await ExportControlModel.find();
        console.log(ecc)
        for(var j=0;j<ecc.length;j++){
            countries.push(ecc[j].cname);
        }
        console.log('countries')
        console.log(countries)
        // ecc.forEach()
        const data = await KYCModel.find();
        console.log(data)
        for(var i=0;i<data.length;i++){
            console.log(data[i].lei)
            const LEINo = data[i].lei;
            const name =  data[i].name;
            const email = data[i].email;
            const wallet = data[i].wallet;
            const country = data[i].country;
            const kycregDate = data[i].kycreg;
            const currentDate = new Date();
            const mongo_id = data[i]._id

           if(LEINo === ''){
            //Missing LEI in KYC Collection
            console.log('MISSING LEI INFO in KYC Collection')
           }
           else{ //LEI Available in KYC Collection
            //GLEIF LEI Verification - Check if lei records Available
            const parsedata = await httpGet(LEINo);       
                  console.log('Data Fetched from GLEIF API');
                  const convertedCountry = country.toUpperCase(); 
                  //Check if country is within country list available 
                  if(countries.includes(convertedCountry)){
                    console.log('export controlled countries')
                    if(parsedata.data.length != 0 ){ 
                        //Check with lei status
                        const GLEIF_LEIStatus = parsedata.data[0].attributes.entity.status;
                        const GLEIF_Address = parsedata.data[0].attributes.entity.legalAddress.addressLines[0];
                        console.log(GLEIF_LEIStatus);
                        finalTransactionRecord = {"status":GLEIF_LEIStatus,"lei":LEINo ,"name":name, "email": email,"wallet":wallet,"kycreg":kycregDate,"checkDate":currentDate,"mongoID":mongo_id,"legalAddress":GLEIF_Address,"country":"Un-Authorized","cname":country}
                        transArray.push(finalTransactionRecord)
                      }
                      else{
                        console.log('NO RECORDS FOUND');
                        finalTransactionRecord = {"status":"NO RECORDS AVAILABLE","lei":LEINo ,"name":name, "email": email,"wallet":wallet,"kycreg":kycregDate,"checkDate":currentDate,"mongoID":mongo_id,"legalAddress":'Not Available',"country":"Un-Authorized","cname":country}
                        transArray.push(finalTransactionRecord)
                    
                      }
                }
                  else{
                    console.log('export allowed countries')  
                  }
                
           }
        }
        res.json(transArray);

    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.get('/getLogs/:lei', async (req, res) => {
    try{
    console.log(req.params.lei)
        const LEI =req.params.lei;
         const findResult = await LogModel.find({
      lei: LEI,
      });
        res.json(findResult);
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
//Get by ID Method
router.get('/getHistory/:lei', async (req, res) => {
    const orderDetails = [];
    try {
        console.log(req.params.lei)
        const LEI =req.params.lei;
        const data = await TransactionModel.find();
        for(var i=0;i<data.length;i++){
            console.log(data[i])
            const DBLEI = data[i].lei;
            if(DBLEI === LEI){
                data[i].order.forEach((orderInfo) => {
                    console.log(orderInfo);
                    const consignee = orderInfo.consignee;
                    const quantity = orderInfo.quantity;
                    const orderProduct = orderInfo.orderDetails;
                    const orderId = orderInfo.orderId;
                    const date = orderInfo.date;
                    const origin = orderInfo.origin
                    const destination = orderInfo.destination;
                    const eccstatus = orderInfo.eccstatus;
                    const orderstatus = orderInfo.orderstatus;
                    orderDetails.push({"consignee":consignee,"quantity":quantity,"orderDetails":orderProduct, "orderId":orderId,"orderdate":date,"origin":origin,"destination":destination,"eccstatus":eccstatus,"orderstatus":orderstatus})
                  });
                  res.json(orderDetails)
    
            }
        }
        }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.get('/getOrderData/:order', async (req, res) => {
    try {
        const ORDERNO = req.params.order;
        const data = await OrderModel.findOne({ "OrderNo": ORDERNO });
        
        if (data) {
            return res.json(data);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//Code Added for SWIFT challenge - transaction fraud detection
router.get('/getHistoricalTransactionFraudDetection/:lei', async (req, res) => {
    // Capture the searched LEI from the request parameters
    const searchedLEI = req.params.lei;
    console.log('Searched LEI:', searchedLEI);

    try {
        // Find transactions where the searched LEI matches exactly in one of the specified fields
        const transactions = await HistoricalTransactionModel.find({
            $or: [
                { leiOrig: searchedLEI },
                { leiDest: searchedLEI },
                { leiShipper: searchedLEI }
            ]
        });

        console.log('Transactions found:', transactions);

        // Debugging: Log the fields and their values
        transactions.forEach(transaction => {
            console.log(`Transaction ID: ${transaction._id}, leiOrig: ${transaction.leiOrig}, leiDest: ${transaction.leiDest}, leiShipper: ${transaction.leiShipper}`);
        });

        // Filter the transactions to include only those where the searched LEI is an exact match
        const filteredTransactions = transactions.filter(transaction => 
            transaction.leiOrig === searchedLEI || 
            transaction.leiDest === searchedLEI || 
            transaction.leiShipper === searchedLEI
        );

        console.log('Filtered Transactions:', filteredTransactions);

        // Return the filtered transactions
        res.json(filteredTransactions);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
});


//Update by ID Method
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await KYCModel.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await KYCModel.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;
