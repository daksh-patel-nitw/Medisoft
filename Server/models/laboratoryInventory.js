import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const UserSchema=new Schema(
    {   
        name:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        //what patient details are required
        pat_details:{
            type:String,
            required:true
        },
        //Test Amount to be normal
        normal:{
            type:String,
            required:true
        },
        timing:Array,

    },{
        versionKey:false
    }
);

const labModel = model("lab", UserSchema);

export default labModel;