const appointment=require('../models/appointment')
const tt=require('../models/timings')
const {generateBill}=require("./billAndHelper");

exports.makeOpdAppointment=async(b)=>{
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
    
    const msg='\nMEDISOFT-HMS\n'+b.pname+' Appointment Booked Successful\nDate:'+b.schedule_date+'\nTimings:'+b.time;
    await client.messages
    .create({
        body: msg,
        from: '+16204079430',
        to: '+919510836469'
    })
    .then(message => console.log(message.sid))
    .done();

    return newT;

};


exports.makeIpdAppointment=async(b)=>{    
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

    return newA;
};

//doctor screen to view patient previous appointments
exports.getAllPatientApps= async (pid,did)=>{  
    const d=await appointment.find({pid:pid,did:did,status:'D'});
    return d;
}

//get all pteint appointments for patient screen
exports.getPatientApp=async(pid)=>{
    const d=await appointment.find({pid:pid});
    return(d);
}

exports.getdoctorapp=async(did)=>{
    const d=await appointment.find({did:did}).sort({createdAt:1});
    return(d);
}

//Confirm Appointment on Counter-2
exports.confirmAppointment= async ({ _id, doctor_qs, weight, height }) => {

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


      return(updatedP);
    } catch (error) {
      console.error(error);
      return('Internal Server Error');
    }
  }
  
//Doctor Diagnosis done in opd
exports.diagnoseOpd=async(b)=>{

    const updatedP = await appointment.findOneAndUpdate(
        { _id: b._id },
        { status:'D',notes:b.notes, discharge_date:Date.now(),title:b.title,medicines:b.medicines,
        tests:b.tests},
        { new: true, useFindAndModify: false  });
        return(updatedP); 
}


//Send Appointments with department for opd2
exports.getCounter2app=async(dep)=>{
    
    const today = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }).slice(0, 10);
    console.log(today);
    const apps=await appointment.find({dep:dep,schedule_date: today,status:'P'},{ pid:1,pname:1,mobile:1,dname:1,time:1,status:1,doctor_qs:1,weight:1,    });
    return apps;
}


//doctor_appointment
exports.getappointment=async(did)=>{
  console.log(did);
  const appointmentToUpdate = await appointment.findOne({ did: did, status: 'confirm' }).sort({ ctime: 1 });
  console.log(appointmentToUpdate)
  const inProgress = await appointment.findOne({ did: did, status: 'progress' }).sort({ ctime: 1 });
  if(inProgress){
    return inProgress
  }
  else if (appointmentToUpdate) {
    await appointment.updateOne(
      { _id: appointmentToUpdate._id },
      { $set: { status: 'progress' } },
      {returnOriginal: false }
    );
    return(appointmentToUpdate);
  } else {
    return('No confirmed appointments found for this doctor');
  }

}

//doctor IPD appointment
exports.getIpdappointment=async(did)=>{
  const app=await appointment.find({did:did,status:'I'});
  return(app);
}

//Update appointment details iPD
exports.updateIPDpat=async(updatedEmployee)=>{
  
  try {
    const result = await appointment.findOneAndUpdate({ _id: updatedEmployee._id }, { $set: updatedEmployee }, { new: true });
    console.log('Update result:', result);
    return(result);
  } catch (error) {
    console.error('Update error:', error);
    return('Error updating employee');
  }
}

// display patient name on the queue screen
exports.queuescreen=async(did)=>{
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
    return(t);
}

//Cancel Appointment
exports.deleteappointment=async(b)=>{
    const updatedP = await appointment.findOneAndUpdate(
        { _id: b },
        { status:'cancel'},
        { new: true, useFindAndModify: false  });
        return(updatedP)
}

exports.seeappointment=async(id)=>{
  const p=await appointment.find({did:id,status:'P'},)
  const c=await appointment.find({did:id,status:'confirm'},)
  const d=await appointment.find({did:id,status:'D'},)
  const arr=[[...p],[...c],[...d]]
  return(arr);
}



