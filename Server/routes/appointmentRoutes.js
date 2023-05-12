const express=require('express');
const router=express.Router();
const appointment=require('../models/appointment')
const tt=require('../models/timings')
const bodyParser=require("body-parser");
const {generateBill}=require("./helper");
// const twilio = require('twilio');
// const accountSid = 'AC68eaa778b2a20e63ece41712af3584ed';
// const authToken = 'ff960610dd1d9e9ab52915683345f96b';
// const client = new twilio(accountSid, authToken);

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

//Create New Appointment on Counter-1
router.post('/newappointment',async (req,res)=>{
    const b=req.body

    const newA= new appointment({
        pid:b.pid,
        did:b.did,
        pname:b.pname,
        mobile:b.mobile,
        dname:b.dname,
        status:'P',
        schedule_date:b.schedule_date,
        time:b.time,
        dep:b.dep,
        doctor_qs:[b.qs]
    });
    await newA.save();
    console.log(newA);

    const newT=new tt({
        date:(new Date(b.schedule_date)).toLocaleString('en-US', { timeZone: 'Asia/Kolkata', month: 'long', day: 'numeric', year: 'numeric'  }),
        did:b.did,
        timing:b.time,
        count:b.count-1
    })

    await newT.save()
    
    // const msg='\nMEDISOFT-HMS\n'+b.pname+' Appointment Booked Successful\nDate:'+b.schedule_date+'\nTimings:'+b.time;
    // await client.messages
    // .create({
    //     body: msg,
    //     from: '+16204079430',
    //     to: '+919510836469'
    // })
    // .then(message => console.log(message.sid))
    // .done();

    res.send(newT);

});

//Ipd Appointment
router.post('/newipdappointment',async (req,res)=>{
    const b=req.body
    
    const newA= new appointment({
        pid:b.pid,
        did:b.did,
        pname:b.pname,
        mobile:b.mobile,
        dname:b.dname,
        status:'I',
        schedule_date:Date.now(),
        time:'n',
        dep:b.dep,
    });
    await newA.save();
    console.log(newA);

    res.send(newA);
});

router.get('/viewpatientapp/:pid/:did',async(req,res)=>{
    const d=await appointment.find({pid:req.params.pid,did:req.params.did,status:'D'});
    res.send(d);
})
router.get('/onlypatientapp/:pid',async(req,res)=>{
    const d=await appointment.find({pid:req.params.pid});
    res.send(d);
})

router.get('/getdoctorapp/:did',async(req,res)=>{
    const d=await appointment.find({did:req.params.did}).sort({createdAt:1});
    res.send(d);
})

//Confirm Appointment on Counter-2
router.put('/updatecapp', async (req, res) => {
    const { _id, doctor_qs, weight, height } = req.body;
  
    try {
      const updatedP = await appointment.findByIdAndUpdate(
        _id,
        { status: 'confirm', ctime:Date.now(), doctor_qs, weight, height },
        { new: true }
      );
    console.log(updatedP);

    const des=`<table style='width: 100%; border-collapse: collapse;'>
    <tr><th style='border: 1px solid black; padding: 5px;'>Description</th><th style='border: 1px solid black; padding: 5px;'>Quantity</th><th style='border: 1px solid black; padding: 5px;'>Price</th></tr><tr><td style='border: 1px solid black; padding: 5px;'>${updatedP.dname} appointment charge</td><td style='border: 1px solid black; padding: 5px;'>1</td><td style='border: 1px solid black; padding: 5px;'>500</td></tr></table><h2>Total: 500</h2>`;
    const newBill = await generateBill(updatedP.pid,500, updatedP._id, des, 'Appointment', true, updatedP.admitted_date);
    console.log("Bill in Route:",newBill)


      res.send(updatedP);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
//Doctor Diagnosis
router.post('/diagnoseopd',async(req,res)=>{
    const b=req.body;
    const updatedP = await appointment.findOneAndUpdate(
        { _id: b._id },
        { status:'D',notes:b.notes, discharge_date:Date.now(),title:b.title,medicines:b.medicines,
        tests:b.tests},
        { new: true, useFindAndModify: false  });
        res.send(updatedP); 
})


//Send Data Appointments with department
router.get('/getapp/:dep',async(req,res)=>{
    const dep=req.params.dep;
    const today = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }).slice(0, 10);
    console.log(today);
    const apps=await appointment.find({dep:dep,schedule_date: today,status:'P'},{ pid:1,pname:1,mobile:1,dname:1,time:1,status:1,doctor_qs:1,weight:1,    });
    res.send(apps);
})


//doctor_appointment
router.get('/getappointment/:did/',async(req,res)=>{
  const did = req.params.did;
  console.log(did);
  const appointmentToUpdate = await appointment.findOne({ did: did, status: 'confirm' }).sort({ ctime: 1 });
  console.log(appointmentToUpdate)
  const inProgress = await appointment.findOne({ did: did, status: 'progress' }).sort({ ctime: 1 });
  if(inProgress){
    res.send(inProgress);
  }
  else if (appointmentToUpdate) {
    await appointment.updateOne(
      { _id: appointmentToUpdate._id },
      { $set: { status: 'progress' } },
      {returnOriginal: false }
    );
    res.send(appointmentToUpdate);
  } else {
    res.status(404).send('No confirmed appointments found for this doctor');
  }

})

//doctor IPD appointment
// localhost:5000/api/getIpdappointment/E000000G
router.get('/getIpdappointment/:did',async(req,res)=>{
  const app=await appointment.find({did:req.params.did,status:'I'});
  res.send(app);
})

//Update appointment details iPD
router.put('/updateIPDpat',async(req,res)=>{
  const updatedEmployee = req.body;
  
  try {
    const result = await appointment.findOneAndUpdate({ _id: updatedEmployee._id }, { $set: updatedEmployee }, { new: true });
    console.log('Update result:', result);
    res.send(result);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).send('Error updating employee');
  }
  
})

router.get('/queuescreen/:id',async(req,res)=>{
  const did=req.params.id;
  const app1=await appointment.findOne({ did: did, status: 'progress' },{pname:1,pid:1,status:1,ctime:1}).sort({ ctime: 1 });
  console.log(did)
  const app = await appointment.find({ did: did, status: 'confirm' },{pname:1,pid:1,status:1,ctime:1}).sort({ ctime: 1 });
  console.log(app1)
  let t;
  if(app1){
     t=[app1,...app];
  }else{
     t=app;
  }
    
    console.log(did,t);
    res.send(t);
})

//Cancel Appointment
router.delete('/deleteappointment/:id',async(req,res)=>{
    const b=req.params.id;
    const updatedP = await appointment.findOneAndUpdate(
        { _id: b },
        { status:'cancel'},
        { new: true, useFindAndModify: false  });
        res.status(200).send(updatedP)
    
        //Ack
})

router.get('/seeappointment/:id',async(req,res)=>{
  const id=req.params.id;
  const p=await appointment.find({did:id,status:'P'},)
  const c=await appointment.find({did:id,status:'confirm'},)
  const d=await appointment.find({did:id,status:'D'},)
  const arr=[[...p],[...c],[...d]]
  res.send(arr);
})



module.exports=router;