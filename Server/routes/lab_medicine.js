const m_n = require('../models/medicine_name');
const t_n = require('../models/test_name');
const test = require('../models/tests');
const medicine = require('../models/medicine');
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const {generateBill}=require("./helper");

// ===========================Medicine_Name=========================

//Add new medicine
router.post('/newmedicine',async(req,res)=>{
    const b =req.body;

    const newM=new m_n({
        name:b.name+" "+b.q,
        price:b.price,
        t:b.t,
        ps:b.ps,
        ps_u:b.ps_u
    })
    await newM.save();
    res.send(newM);
})

//Send all medicine to doctor
router.get('/getmedicinedoctor',async(req,res)=>{
    const allT = await m_n.find({},{name:1, ps:1,t:1,price:1});
    res.send(allT);
})

//Send all mediciene to pharmacy
router.get('/allmedicines',async(req,res)=>{
    try {
        const allMedicines = await m_n.find();
        res.send(allMedicines);
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
      res.send((doc));
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

router.post('/addnewm',async(req,res)=>{
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
  res.send(newM);
})

//Get medicines
router.get('/getmedicines',async(req,res)=>{
  const allT = await medicine.find({status:'F'});
  const allT1 = await medicine.find({status:'D'});
  arr=[[...allT],[...allT1]]
  res.send(arr);
})

//Finish medicine
router.post('/finishmedopd', async (req, res) => {
  try {
    const { _id, pid, quantity, price, aid, mname, unit, date } = req.body;
    const priceTotal = quantity * price;
    const update = await medicine.findByIdAndUpdate(_id, { status: 'D' }, { new: true });
    const newBill = generateBill(pid, priceTotal, aid, `${mname} ${quantity} ${unit}`, "medicine", true, date);
    res.send({ update, newBill });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

//-------------------------------LABORATORY-----------------------------------------

//Add test
router.post('/newtest',async (req,res)=>{
  const body =req.body;

  const newT=new t_n({
  name:body.name,
  price:body.price,
  pat_details:body.pat_details,
  normal:body.normal
  })
  
  await newT.save();
  res.send(newT);
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
    res.send((doc));
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

//Send All Tests to laboratory
router.get('/alltest',async(req,res)=>{
  try {
    const allMedicines = await t_n.find();
    res.send(allMedicines);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
})

//delete medicine
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
router.post('/newpatienttest',async (req,res)=>{
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
  res.send(newT);
})

//Send All laboratory tests status 
router.get('/getlabtests',async(req,res)=>{
    const allT = await test.find({details:'P'});
    const allT1 = await test.find({details:'D',status:'F'});
    const allT2 = await test.find({status:'D'});
    const arr1=[[...allT],[...allT1],[...allT2]];
    console.log(allT1);
    res.send(arr1);
})

//Update patient details
router.get('/updatedetails/:id',async(req,res)=>{
    const id=req.params.id
    const allT = await test.findByIdAndUpdate(id,{details:'D'}, { useFindAndModify: false });
    res.send(allT);
});

// Finish the test 
router.get('/donetest/:id/:value', async (req, res) => {
  try {
  //   const b = req.body;
  //   const nB = generateBill(
  //     b.pid,
  //     b.price,
  //     b.aid,
  //     b.tname,
  //     "test",
  //     true,
  //     b.date
  //   );
    const allT = await test.findByIdAndUpdate(
      req.params.id,
      { p_range: req.params.value, status: 'D' },
      { new: true, useFindAndModify: false }
    );
    res.send({ updatedTest: allT });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});



module.exports = router;