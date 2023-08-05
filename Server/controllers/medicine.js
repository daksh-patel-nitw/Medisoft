const m_n = require('../models/medicine_name');
const t_n = require('../models/test_name');
const test = require('../models/tests');
const medicine = require('../models/medicine');
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
// const {generateBill}=require("./helper");
const patient = require('../models/appointment');
// ===========================Medicine_Name=========================

//Add new medicine
exports.newmedicine',async(req,res)=>{
    const b =req.body;

    const newM=new m_n({
        name:b.name+" "+b.q,
        price:b.price,
        t:b.t,
        ps:b.ps,
        ps_u:b.ps_u
    })
    await newM.save();
    return(newM);
})

//Send all medicine to doctor
exports.getmedicinedoctor',async(req,res)=>{
    const allT = await m_n.find({},{name:1, ps:1,t:1,price:1});
    return(allT);
})

//Send all mediciene to pharmacy
exports.allmedicines',async(req,res)=>{
    try {
        const allMedicines = await m_n.find();
        return(allMedicines);
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
      }
})

//update medicine detail
router.put('/updatemedicine/:value', async (req, res) => {
    const name_ = req.body._id;
    const value = req.params.value;
    // console.log(name_,value,req.body[value]);
    try {
      const doc = await m_n.findOneAndUpdate({ _id: name_ }, { useFindAndModify: false });
      console.log(doc);
      if(value==="ps_u"){
            sum=parseInt(doc['ps_u']);
            sum=sum+parseInt(req.body[value]);
            doc.ps_u=sum;
            
      }else{
          doc[value]=req.body[value];
      }
      await doc.save();
      console.log(doc);
      return((doc));
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  //delete medicine
  router.delete('/deletemedicine/:id',async(req,res)=>{
    const id = req.params.id;
    try {
        const deletedMedicine = await m_n.findByIdAndDelete(id);
        res.json({ message: 'Medicine deleted successfully', deletedMedicine });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting medicine' });
      }
  })

//------------------------------Medicines----------------------

exports.addnewm',async(req,res)=>{
  b=req.body;
  console.log(b);
  const newM=new medicine({
    pid:b.pid,
    aid:b.aid,
    mname:b.name,
    pname:b.pname,
    did:b.did,
    quantity:(Number(b.ps_c)+(Number(b.ps)*Number(b.ps_u))),
    unit:b.t,
    price:b.price,
    date:b.date,
  })
  await newM.save();
  console.log(newM);
  return(newM);
})

//Get medicines
exports.getmedicines',async(req,res)=>{
  const allT = await medicine.find({status:'F'});
  const allT1 = await medicine.find({status:'D'});
  arr=[[...allT],[...allT1]]
  return(arr);
})

//Finish medicine
exports.finishmedopd', async (req, res) => {
  try {
    const data=req.body;
    const priceTotal = data.pop();
    const des = data.pop();
    console.log("After Slice data",data);
    data.forEach(async(m,index) => {
      const update = await medicine.findByIdAndUpdate(m._id, { status: 'D' }, { new: true });
      console.log("Updating medicine ",index,update);
      
      const med = await m_n.findOne({name: m.mname, t: m.unit});
      console.log("Medicine:",index,med)
      med.ps_u = med.ps_u - Math.floor(m.quantity / Number(med.ps));
      med.ps_c = med.ps_c + (m.quantity % Number(med.ps));
      await med.save();
      console.log("Medicine After:",med)
    });
    console.log(data[0]);
    const newBill = await generateBill(data[0].pid, priceTotal, data[0].aid, des, "medicine", true, data[0].createdAt);
    console.log("Bill in Route:",newBill)
    // pid,price,aid,des,type,status,date
    return({ update: newBill });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

//-------------------------------LABORATORY-----------------------------------------

//Add test
exports.newtest',async (req,res)=>{
  const body =req.body;

  const newT=new t_n({
  name:body.name,
  price:body.price,
  pat_details:body.pat_details,
  normal:body.normal
  })
  
  await newT.save();
  return(newT);
})

//update medicine detail
router.put('/updatetest/:value', async (req, res) => {
  const name_ = req.body._id;
  const value = req.params.value;
  // console.log(name_,value,req.body[value]);
  try {
    const doc = await t_n.findOneAndUpdate({ _id: name_ }, { useFindAndModify: false });
    console.log(doc);
    doc[value]=req.body[value];
    
    await doc.save();
    console.log(doc);
    return((doc));
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

//Send All Tests to laboratory
exports.alltest',async(req,res)=>{
  try {
    const allMedicines = await t_n.find();
    return(allMedicines);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
})

//delete test
router.delete('/deletetest/:id',async(req,res)=>{
  const id = req.params.id;
  try {
      const deletedMedicine = await t_n.findByIdAndDelete(id);
      res.json({ message: 'Medicine deleted successfully', deletedMedicine });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting medicine' });
    }
})

//-----------------Tests-------------------------

//add Test from doctor
exports.newpatienttest',async (req,res)=>{
  const body =req.body;

  const newT=new test({
    did:body.did,
    pid:body.pid,
    aid:body.aid,
    price:body.price,
    pname:body.pname,
    pat_details:body.pat_details,
    tname:body.name,
    n_range:body.normal,
    date:body.date,
  })
  
  await newT.save();
  console.log(newT);
  return(newT);
})

//Send All laboratory tests status 
exports.getlabtests',async(req,res)=>{
    const allT = await test.find({details:'P'});
    const allT1 = await test.find({details:'D',status:'F'});
    const allT2 = await test.find({status:'D'});
    const arr1=[[...allT],[...allT1],[...allT2]];
    // console.log(allT1);
    return(arr1);
})

//Update patient details
exports.updatedetails/:id',async(req,res)=>{
    const id=req.params.id
    const allT = await test.findByIdAndUpdate(id,{details:'D'}, { useFindAndModify: false });
    const status=allT.patStatus==='IPD'?false:true;
    
    const des=`<table style='width: 100%; border-collapse: collapse;'>
        <tr><th style='border: 1px solid black; padding: 5px;'>Description</th><th style='border: 1px solid black; padding: 5px;'>Quantity</th><th style='border: 1px solid black; padding: 5px;'>Price</th></tr><tr><td style='border: 1px solid black; padding: 5px;'>${allT.tname}</td><td style='border: 1px solid black; padding: 5px;'>1</td><td style='border: 1px solid black; padding: 5px;'>${allT.price}</td></tr></table><h2>Total: ${allT.price}</h2>`;

    const newBill = await generateBill(allT.pid, allT.price, allT.aid, des, 'Lab', status, allT.createdAt);
    console.log("Bill in Route:",newBill)

    return(allT);
});

// Finish the test 
exports.donetest/:id/:value', async (req, res) => {
  try {
    const allT = await test.findByIdAndUpdate(
      req.params.id,
      { p_range: req.params.value, status: 'D' },
      { new: true, useFindAndModify: false }
    );
    console.log('test:',allT);
    const p=await patient.updateOne({ _id: allT.aid }, { $set: { "tests.$[elem].p_range": allT.p_range } }, { arrayFilters: [{ "elem.name": allT.tname }] });
    console.log(p);
    return({ updatedTest: allT,newapp:p});
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});



module.exports = router;