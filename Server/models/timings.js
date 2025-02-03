import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const UserSchema=new Schema(
    {   
        did:String,
        date:Date,
        timing:{
            type:String,
            required:true
        },
        count:{
            type:Number,
            required:true
        }
    },{
        versionKey:false,
        timestamps:true
    }
);

const timingModel=mongoose.model("Timing",UserSchema);

export default timingModel;