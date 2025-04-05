import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const UserSchema=new Schema(
    {   
        pid:{
            type:String,
            required:true
        },
        mobile:{
            type:Number,
            required:true
        },
        pname:{
            type:String,
            required:true
        },
        did:{
            type:String,
            required:true
        },
        dname:{
            type:String,
            required:true
        },
        schedule_date:{
            type:Date,
            required:true
        },
        //canceled, Doctor Screen, pending, intermediate, confirmed, IPD
        status:{
            type:String,
            enum:['cancel','D','P','progress','confirm','I'],
            required:true
        },
        dep:{
            type:String,
            required:true
        },
        
        time:String,
        discharge_date:Date,

        notes:String,
        doctor_qs:{
            type:[String],
            default:undefined
        },
        weight:Number,
        ctime:Number,
        height:Number,
        feedback:{
            type:Number,
            default:0
        },
        bill:{
            type:Boolean,
            default:false
        },
        selected_doctor_qs:String
    },{
        versionKey:false
    }
);

const appointmentModel= model("appointment",UserSchema);

export default appointmentModel;

