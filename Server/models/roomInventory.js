import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const UserSchema=new Schema(
    {   
        type:{
            type:String,
            required:true
        },
        dep:{
            type:String,
            required:true
        },
        date:{
            type:Date,
            default:Date.now
        },
        floor:{
            type:Number,
            required:true
        },
        room_no:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        occupied:{
            type:String,
            default:'No'
        },
        dname:String,
        did:String,
        pid:String,
        aid:String,
        pname:String,
        mobile:Number,
    },{
        versionKey:false,
        timestamps:true
    }
);

const roomInventoryModel = model("roomInventory", UserSchema);

export default roomInventoryModel;