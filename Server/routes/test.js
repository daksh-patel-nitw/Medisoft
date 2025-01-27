const pid=require('../models/helper');
const login=require('../models/login');
const mongoose = require('mongoose');
const mongoDB = "mongodb://localhost:27017/medisoft";

mongoose.connect(mongoDB,(err)=>{
    if(err){
        console.log("Error in connecting",err);
    }
    else{
        console.log("connected to MongoDB");
        insertData();
    }
})


const records1 = [
  {
    uname: 'admin',
    password: 'admin',
    type: 'admin',
    dep: 'admin',
  },
  {
    uname: 'opd2',
    password: 'opd2',
    type: 'opd2',
    dep: 'orthopedic',
  },
];

const records2 = [
  {
    name:'roles',
    content:['doctor','laboratorist','nurse','pharmacist']
  },
  {
    name:'pid',
    content:[1]
  },
  {
    name:'did',
    content:[1]
  },
  {
    name:'dep',
    content:["orthopedic", "neurologist", "cardiologist", "endocrinologist", "gynecologist"]
  }
];

const insertData = async () => {
    
  
    try {
      const result1 = await login.create(records1);
      const result2 = await pid.create(records2);
      console.log('Records added successfully:', result1,result2);
      mongoose.disconnect();
    } catch (error) {
      console.error('Error adding records:', error);
    } 
  };
