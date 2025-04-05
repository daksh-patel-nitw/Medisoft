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
        status:{
            enum: ['Pending','Billed','Discharge','Cancel'],
            type:String,
            default:'Pending'
        },
        aid:{
            type:Schema.Types.ObjectId,
            ref:'appointments'
        },
    },{
        versionKey:false,
        timestamps:true
    }
);

const roomInventoryModel = model("roomInventory", UserSchema);

export default roomInventoryModel;