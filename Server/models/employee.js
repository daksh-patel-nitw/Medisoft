const Mongoose =require('mongoose');

const Schema=Mongoose.Schema;
const UserSchema=new Schema(
    {   
        fname:{
            type:String,
            required:true
        },
        eid:{
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
        degree:{
            type:String,
            required:true
        },
        college:{
            type:String,
            required:true
        },
        certificate:{
            type:String,
            
        },
        pids:Array,
        role:{
            type:String,
            required:true
        },
        dep:{
            type:String,
            required:true
        },
        timings:Array,
        questions:Array
    },{
        versionKey:false
    }
);

const UserModel=Mongoose.model("employee",UserSchema);

module.exports=UserModel;