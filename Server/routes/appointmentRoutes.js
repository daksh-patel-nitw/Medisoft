import express from 'express';
import authenticate from '../middlewares/authenticate.js'; 
const router = express.Router();

//Create New Appointment on Counter-1
router.post('/newappointment',async (req,res)=>{
    const newT=await app.makeOpdAppointment(req.body);
    res.send(newT);
});

//Ipd Appointment
router.post('/newipdappointment',async (req,res)=>{
    const newA=await app.makeIpdAppointment(req.body);
    res.send(newA);
});

router.get('/viewpatientapp/:pid/:did',async(req,res)=>{
    const d=await app.getAllPatientApps(req.params.pid,req.params.did)
    res.send(d);
})

router.get('/onlypatientapp/:pid',async(req,res)=>{
    const d=await app.getPatientApp(req.params.pid);
    res.send(d);
})

router.get('/getdoctorapp/:did',async(req,res)=>{
    const d=await app.getdoctorapp(req.params.did);
    res.send(d);
})

//Confirm Appointment on Counter-2
router.put('/updatecapp', async (req, res) => {
    const updated=await app.confirmAppointment(req.body);
    res.send(updated)
  });
  
//Doctor Diagnosis
router.post('/diagnoseopd',async(req,res)=>{
    const updatedP=await app.diagnoseOpd(req.body);
    res.send(updatedP); 
})


//Send Data Appointments with department
router.get('/getapp/:dep',async(req,res)=>{
    const appointments=await app.getCounter2app(req.params.dep);
    res.send(appointments);
})


//doctor_appointment
router.get('/getappointment/:did/',async(req,res)=>{
  const appointments=await app.getappointment(req.params.did);
  res.send(appointments);
})

//doctor IPD appointment
// localhost:5000/api/getIpdappointment/E000000G
router.get('/getIpdappointment/:did',async(req,res)=>{
  const appointments=await app.getIpdappointment(req.params.did);
  res.send(appointments);
})

//Update appointment details iPD
router.put('/updateIPDpat',async(req,res)=>{
  const updated = await app.updateIPDpat(req.body);
  res.send(updated)
})

router.get('/queuescreen/:id',async(req,res)=>{
  const t=await app.queuescreen(req.params.id);
  res.send(t);
})

//Cancel Appointment
router.delete('/deleteappointment/:id',async(req,res)=>{
    const updated=await app.deleteappointment(req.params.id);
    res.status(200).send(updated)
})


// http://localhost:5000/api/seeappointment/E000000C
router.get('/seeappointment/:id',async(req,res)=>{
  const arr=await app.seeappointment(req.params.id);
  res.send(arr);
})



module.exports=router;