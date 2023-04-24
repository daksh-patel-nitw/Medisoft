const Mongoose =require('mongoose');

const Schema=Mongoose.Schema;
const UserSchema=new Schema(
    {   
        pid:{
            type:String,
            required:true
        },
        fname:{
            type:String,
            required:true
        },
        middlename:{
            type:String,
            required:true
        },
        lname:{
            type:String,
            required:true
        },
        mobile:{
            type:Number,
            length:10,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        dob:{
            type:Date,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        pincode:{
            type:Number,
            length:6,
            required:true
        },
        gender:{
            type:String,
            enum:['M','F','O'],
            required:true
        },
        weight:Number ,
        height:Number,
        allergy:{
            type:String,
            required:true
        },
        conditions:{
            type:String,
            required:true
        },
        others:{
            type:String,
            default:'none'
        }
    },{
        versionKey:false
    }
);

const UserModel=Mongoose.model("Patient",UserSchema);

module.exports=UserModel;