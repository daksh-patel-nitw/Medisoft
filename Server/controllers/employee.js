const emp=require('../models/employee')
const helper =require('./billAndHelper');
const timings_=require('../models/timings');

//Register New employee*******
exports.newemployee=async(body)=>{
    
    eid='E'+await helper.generateId('eid');
    
    const newP = new emp({
        eid:eid,
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
    return(newP);
   
};


//Get the employee with specific role
exports.getemployee=async(role)=>{
    const allT=await emp.find({role:role},{fname:1, lname:1,dep:1, eid:1,timings:1,questions:1,pph:1});
    const newT=[];
    allT.map((e)=>{
      // console.log(e.questions);
        const t={dname:e.fname+" "+e.lname,dep:e.dep,did:e.eid,timings:e.timings,qs:e.questions,pph:e.pph};
        newT.push(t);
    })
    return(newT);
};

//get Doctor timings
exports.getdtimings=async(date_no,did)=>{
    console.log(date_no,did);
    const d=(new Date(Number(date_no))).toLocaleString('en-US', { timeZone: 'Asia/Kolkata', month: 'long', day: 'numeric', year: 'numeric'  });
    console.log(d);
    const t=timings_.aggregate([
        // Match the documents with the given date
        {
          $match: { date: d ,did: did}
          
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
      

};


//send Employee detail
exports.getempwithid=async(id)=>{
    const c= await emp.findOne({eid:id})
    // console.log(c);
    return(c);
}

//update employee document
// addtimings-----*
exports.updateEmployee= async (body) => {
  try {
    const result = await emp.findOneAndUpdate({ eid: body.eid }, { $set: body }, { new: true });
    console.log('Update result:', result);
    return(result);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).send('Error updating employee');
  }
};

//Send all doctors to queueScreen
exports.allDoctors=async(d)=>{
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
  return(arr);
};

exports.adminGetEmp=async()=>{

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

  return(arr);
};


module.exports = router;

