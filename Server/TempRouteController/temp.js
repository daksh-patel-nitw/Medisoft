const helper=require('../controllers/billAndHelper')
const express=require('express');
const router=express.Router();
const bodyParser=require("body-parser");
const { recompileSchema } = require('../models/helper');


router.post('/updateHelper',async(req,res)=>{
  const b=req.body;
  console.log(b)
  const doc=await helper.updateHelper(b.name,b.content);
  console.log(doc);
  res.send(doc);
})

//Get doctor department from helper
router.get('/deps', async(req,res)=>{
  const allT=await helper.getItem('dep');
  res.send(allT);
})

//Send departments and roles to admin
router.get('/getRolesDeps',async(req,res)=>{
  const arr=[await helper.getItem('roles')];
  arr.push(await helper.getItem('dep'))
  res.send(arr);
})

router.get('/tester',async(req,res)=>{
  const eid=await helper.generateId('eid');
  res.send(eid);
})

module.exports = router;

//roles,pid,eid,dep,medicine_type