const helper = require('../models/helper');

exports.updateHelper=async(name,content)=>{
   console.log
   const doc=await helper.updateOne({name:name},{$set:{content:content}})
   return doc;
}

exports.sendList=async()=>{
   const doc = await helper.find({ $or: [{ name: 'dep' }, { name: 'roles' }] });
   return doc;
}