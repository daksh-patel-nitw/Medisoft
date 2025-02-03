import mongoose from 'mongoose';

const { Schema, model } = mongoose;
    const UserSchema=new Schema(
    {   
        type:{
            type:String,
            required:true
        },
        beds:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        sofa:{
            type:String,
            required:true
        },
        tv:{
            type:String,
            required:true
        },
        refrigator:{
            type:String,
            required:true
        },
        bathroom:{
            type:String,
            required:true
        },
        other:String
    },{
        versionKey:false
    }
);

const roomModel = model("room", UserSchema);

export default roomModel;