const express = require('express');
const router = express.Router();
const l_Data=require('../models/login')
const bodyParser = require("body-parser");
// const helperF =require('./helper');
const bill=require('../models/bill');

// ---------------Login-----------------------------------------------
router.post('/login', async (req, res) => {
    const { uname, password } = req.body;
    console.log(req.body);
    const user = await l_Data.findOne({ uname });
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    res.status(200).json(user);
  });
  
  router.post('/addlogin', async (req, res) => {
    const b = req.body;
    const password=''
    // await helperF.generatePassword();
    const newLogin = new l_Data({
      uname: b.eid,
      password: password,
      type: b.type,
      dep : b.dep,
    });
    
    await newLogin.save();
    console.log(newLogin)
    res.send(newLogin);
  });

router.get('/getAllLogin', async (req, res) => {

  const f=await l_Data.find({type:{$ne:'patient'}},{uname:1,dep:1,type:1})
  res.send(f);
})

router.get('/deleteLogin/:id', async (req, res) => {
  
  const f=await l_Data.findByIdAndDelete(req.params.id);
  res.send(f)
})

// --------------------------Bill-----------------------------
router.get('/getBill/:id', async (req, res) => {
  const allT = await bill.find({pid:req.params.id});
  
  res.send(allT)
})
router.get('/getallBills', async (req, res) => {
  const allT = await bill.find({status:false});
  const allT1 = await bill.find({status:true});
  arr=[[...allT],[...allT1]]
  res.send(arr)
})

module.exports = router;
