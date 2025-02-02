import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const UserSchema=new Schema(
    {   
        aid:{
            type:String,
            required:true
        },
        did:{
            type:String,
            required:true
        },
        pid:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        pname:{
            type:String,
            required:true
        },
        tname:{
            type:String,
            required:true
        },
        //patients details range
        p_range:String,
        //normal range
        n_range:String,
        pat_details:{
            type:String,
            required:true
        },
        //to get the patient details
        details:{
            type:String,
            default:'P'
        },
        report:String,
        //to add the results of the test
        status:{
            type:String,
            default:'F'
        },
    },{
        versionKey:false,
        timestamps:true
    }
);


const labPrescriptionModel = model("labPrescription", UserSchema);

export default labPrescriptionModel;