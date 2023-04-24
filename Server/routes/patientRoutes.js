const express = require('express');
const router = express.Router();
const patient = require('../models/patient');
const uniqueN = require('../models/helper');
const login = require('../models/login');
const bodyParser = require("body-parser");
const helper =require('./helper');

const twilio = require('twilio');
const accountSid = 'AC68eaa778b2a20e63ece41712af3584ed';
const authToken = 'ff960610dd1d9e9ab52915683345f96b';
const client = new twilio(accountSid, authToken);

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


//get Patientdetails for doctor
router.get('/getpatientdoctor/:id', async (req, res) =>
{
    const id=req.params.id;
    try {
        const patient_ = await patient.findOne({ pid: id }, {allergy:1 ,conditions:1, others:1});
        res.send(patient_);
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
      }
});

//Get Patient Details
router.get('/getpatient', async (req, res) =>
{
    try {
        const allT = await patient.find({}, 'pid fname lname mobile');
        const newT=[];
        allT.map((e)=>{
            const t={pname:e.fname+" "+e.lname,pid:e.pid,mobile:e.mobile};
            newT.push(t);
        })
        res.send(newT);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.post('/newpatient', async (req, res) =>
{
    const body=req.body;
    const doc=await uniqueN.findOneAndUpdate({name:'pid'})
    num=doc.content.pop();
    pid=await helper.generateId(num)
    num++;
    doc.content.push(num);
    await doc.save();
    // console.log("increased the pid");
    const newP = new patient({
        pid:'P'+pid,
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
        allergy: body.allergy,
        conditions: body.conditions,
        others:body.others
    });
    await newP.save();
    // console.log("Added New Patient Successfully");
    const password=await helper.generatePassword();

    const newl=new login({
        uname:pid,
        password:password,
        type:'patient'
    });

    await newl.save();
    
    await client.messages
    .create({
        body: '\nMEDISOFT-HMS\n'+'body.fname'+' registered Successfully\nUsername:'+pid+'\nPassword:'+password,
        from: '+16204079430',
        to: '+919510836469'
    })
    .then(message => console.log(message.sid))
    .done();

    res.json({
        message: "Successfully Added patient",
        status:200
    });
    //add twilo code ehere
})

router.get('/test', async (req, res) => {
    try {
      // const id = req.params.id;
      const appointmentData = await patient.find();
      res.send(appointmentData);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
  
module.exports = router;