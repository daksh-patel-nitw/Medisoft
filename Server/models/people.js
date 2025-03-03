import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const UserSchema=new Schema(
    {   
        mid:{
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
        },type:{
            type:String,
            enum:['patient','employee']
        },

        //Patient Required details
        weight:Number ,
        height:Number,
        allergy:String,
        conditions:String,
        others:String,

        //Doctor Required details
        degree:String,
        college:String,
        pids:Array,
        role:String,
        dep:String,
        timings:Array,
        questions:Array,
        pph:Number,
    },{
        versionKey:false,
        timestamps:true
    }
);

const memberModel = model("member", UserSchema);

export default memberModel;