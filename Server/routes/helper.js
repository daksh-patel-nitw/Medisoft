const bill=require('../models/bill');

const generateBill=async(pid,price,aid,des,type,status,date)=>{
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

function generateId(number) {
    let base36 = (number).toString(36).toUpperCase();
    let padded = base36.padStart(7, '0');
    return padded;
  }

  function generatePassword() { 
    var length = 6;
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#%&*!$<>";
    retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) { 
        retVal += charset.charAt(Math.floor(Math.random() * n)); 
    } 
    return retVal; 
}


  module.exports = {
    generatePassword,
    generateId,
    generateBill
  };