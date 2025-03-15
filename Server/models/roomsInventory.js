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
        room_no:{
            type:Number,
            required:true
        },
        charge:Number,
        status:String,
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