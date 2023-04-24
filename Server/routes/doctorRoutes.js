const express=require('express');
const router=express.Router();
const login=require('../models/login')
const emp=require('../models/employee')
const bodyParser=require("body-parser");
const helperF =require('./helper');
const helper=require('../models/helper');
const timings=require('../models/timings');

const twilio = require('twilio');
const { updateOne } = require('../models/timings');

router.post('/newemployee',async(req,res)=>{
    const body=req.body;
    const doc=await helper.findOneAndUpdate({name:'eid'})
    num=doc.content.pop();
    pid=await helperF.generateId(num)
    num++;
    doc.content.push(num);
    await doc.save();
    // console.log("increased the pid");
    const newP = new emp({
        eid:'E'+pid,
        fname: body.fname,
        middlename: body.middlename,
        lname: body.lname,
        mobile: body.mobile,
        email: body.email,
        dob: body.dob,
        address: body.address,
        city: body.city,
        pincode: body.pincode,
        gender: body.gender,
        degree:body.degree,
        college:body.college,
        role:body.role,
        dep:body.dep
    });
    await newP.save();
    res.send(newP);
    
    
})

//Get doctor department from helper
router.get('/deps', async(req,res)=>{
    const param=req.params;
    const allT=await helper.find({name:'dep'});
    res.send(allT);
})

//Get the employee with specific role
router.get('/getemployee/:role',async(req,res)=>{
    const param=req.params;
    const allT=await emp.find({role:param.role},{fname:1, lname:1,dep:1, eid:1,timings:1,questions:1});
    const newT=[];
    allT.map((e)=>{
      console.log(e.questions);
        const t={dname:e.fname+" "+e.lname,dep:e.dep,did:e.eid,timings:e.timings,qs:e.questions};
        newT.push(t);
    })
    res.send(newT);
})

router.get('/getdtimings/:date_no/:did',async(req,res)=>{
    const param=req.params;
    console.log(param.date_no,param.did);
    const d=(new Date(Number(param.date_no))).toLocaleString('en-US', { timeZone: 'Asia/Kolkata', month: 'long', day: 'numeric', year: 'numeric'  });
    console.log(d);
    const t=timings.aggregate([
        // Match the documents with the given date
        {
          $match: { date: d ,did: param.did}
          
        },
        // Group the documents by timings and find the minimum count
        {
          $group: {
            _id: "$timing",
            count: { $min: "$count" }
          }
        }, {
          $sort: {
            _id: 1
          }
        },
        // Project the result to include only the timings and count fields
        {
          $project: {
            _id: 0,
            timings: { $toString: "$_id" },
            count: 1
          }
        },{
          $replaceRoot: {
            newRoot: { $arrayToObject: [[{ k: "$timings", v: "$count" }]] }
          }
        }
      ]);
     

     
      
      t.then(result => {
        if(result.length){
          const obj = result.reduce((acc, curr) => {
            const key = Object.keys(curr)[0];
            acc[key] = curr[key];
            return acc;
          }, {});
          res.status(200).send(obj);
        }else{
          res.status(404).send("Data not found");
        }
      }).catch(error => {
        console.log(error);
        res.status(500).send("Internal server error");
      });
      

})

//make login for employee
router.post('/make_login',async(req,res)=>{
    const password=await helperF.generatePassword();
    body=req.body;
    const newl=new login({
        uname:body.eid,
        password:password,
        type:body.role
    });
    await newl.save();
    res.send(newl);
})

//add doctor timings
router.post('/addtimings',async(req,res)=>{
    const b=req.body;
    const c= await updateOne({eid:b.did},{$set:{timings:b.timings}})
    
    res.send(c);
})

router.get('/allDoctors/:dep',async(req,res)=>{
  const d=req.params.dep;
  const arr=await emp.find({dep:d,role:"doctor"},{eid:1});
  console.log(arr);
  res.send(arr);
})

module.exports = router;

