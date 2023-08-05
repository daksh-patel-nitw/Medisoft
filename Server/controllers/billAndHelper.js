const helper = require('../models/helper');
const bill = require('../models/bill');


//--------------------------------Helper-------------------------------------

//Update Any helper
exports.updateHelper=async(name,content)=>{
   const doc=await helper.updateOne({name:name},{$set:{content:content}})
   return doc;
}

exports.generateId=async(item)=>{
   const number = await helper.findOneAndUpdate(
      { name: item },
      { $inc: { "content.0": 1 } },
      { new: true, useFindAndModify: false }
    )
   
   let base36 = (number.content[0]).toString(36).toUpperCase();
   let padded = base36.padStart(7, '0');
   return padded;
 }

//Send document
exports.getItem=async(name)=>{
   const doc = await helper.findOne({ name: name });
   return doc;
}

//-------------------------------BILLs ----------------------------------------

//generate new bills
exports.generateBill=async(pid,price,aid,des,type,status,date)=>{
   const newB=new bill({
     pid:pid,
     price:price,
     aid:aid,
     description:des,
     type:type,
     status:status,
     date:date
   })
   await newB.save();
   console.log('Bill in Helper:',newB);
   return newB;
 }
 