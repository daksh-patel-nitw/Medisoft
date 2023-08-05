const express=require('express');
const router=express.Router();
const login=require('../models/login')
const emp=require('../models/employee')
const bodyParser=require("body-parser");
const helperF =require('./helper');
const helper=require('../models/helper');
const timings_=require('../models/timings');
const b_and_h=require('../controllers/billAndHelper')

//Register New employee
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
    const allT=await emp.find({role:param.role},{fname:1, lname:1,dep:1, eid:1,timings:1,questions:1,pph:1});
    const newT=[];
    allT.map((e)=>{
      // console.log(e.questions);
        const t={dname:e.fname+" "+e.lname,dep:e.dep,did:e.eid,timings:e.timings,qs:e.questions,pph:e.pph};
        newT.push(t);
    })
    res.send(newT);
})

//get Doctor timings
router.get('/getdtimings/:date_no/:did',async(req,res)=>{
    const param=req.params;
    console.log(param.date_no,param.did);
    const d=(new Date(Number(param.date_no))).toLocaleString('en-US', { timeZone: 'Asia/Kolkata', month: 'long', day: 'numeric', year: 'numeric'  });
    console.log(d);
    const t=timings_.aggregate([
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

//get doctor timings
router.get('/getempwithid/:id',async(req,res)=>{
    const b=req.params.id;
    console.log(b);
    const c= await emp.findOne({eid:b})
    // console.log(c);
    res.send(c);
})

//add doctor timings
router.post('/addtimings', async (req, res) => {
  const { eid } = req.body;
  const updatedEmployee = req.body;
  delete updatedEmployee.eid; // Remove the employee ID from the updated object
  try {
    const result = await emp.findOneAndUpdate({ eid: eid }, { $set: updatedEmployee }, { new: true });
    console.log('Update result:', result);
    res.send(result);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).send('Error updating employee');
  }
})

router.get('/allDoctors/:dep',async(req,res)=>{
  const d=req.params.dep;
  const arr = await emp.aggregate([
    { $match: { dep: d, role: "doctor" } },
    {
      $addFields: {
        fullName: { $concat: ["$fname", " ", "$lname"] }
      }
    },
    { $project: { eid: 1, name: "$fullName" } }
  ]);
  

  console.log(arr);
  res.send(arr);
})

router.get('/admingetemp',async(req,res)=>{

  const arr = await emp.aggregate([
    {
      $project: {
        eid:1,
        mobile:1,
        dep:1,
        role:1,
        name: {
          $concat: ['$fname', ' ', '$lname']
        }
      }
    }
  ]);

  res.send(arr);
})

// -----------------------adminHelper-------------------------

module.exports = router;

