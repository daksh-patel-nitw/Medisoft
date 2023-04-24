const pid=require('../models/helper');
const mongoose = require('mongoose');
const mongoDB = "mongodb://localhost:27017/medisoft";

mongoose.connect(mongoDB,(err)=>{
    if(err){
        console.log("Error in connecting",err);
    }
    else{
        console.log("connected to MongoDB");
    }
})

const n=new pid({
    name:'dep',
    content:["orthopedic", "neurologist", "cardiologist", "endocrinologist", "gynecologist"]
})
n.save();
console.log(n);






// //==========================Twilio===============================================
// const twilio = require('twilio');
// const accountSid = 'AC68eaa778b2a20e63ece41712af3584ed';
// const authToken = 'ff960610dd1d9e9ab52915683345f96b';
// const client = new twilio(accountSid, authToken);
// client.messages
//     .create({
//         body: '\nMEDISOFT-HMS\n'+'[name]'+' registered Successfully\nUsername:'+'P000091.'+'\nPassword:'+' _xyzwer_.',
//         from: '+16204079430',
//         to: '+919510856469'
//     })
//     .then(message => console.log(message.sid))
//     .done();