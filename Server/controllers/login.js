const login=require('../models/login');

//Generate Password 
exports.generatePassword=()=> { 
  var length = 6;
  charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#&*!$";
  retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) { 
      retVal += charset.charAt(Math.floor(Math.random() * n)); 
  } 
  return retVal; 
}

//-------------------------Login------------------------------

//make new login
exports.makeNewLogin=async(body)=>{
  const password=await generatePassword();

  const newl=new login({
      uname:body.id,
      password:password,
      type:body.role,
      dep:body.dep
  });
  await newl.save();
  return(newl);
}



