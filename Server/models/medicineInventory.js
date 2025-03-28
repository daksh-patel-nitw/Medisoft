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
        //type
        t:{
            type:String,
            required:true
        },
        //package_size
        ps:{
            type:Number,
            required:true
        },
        //package quantity
        ps_u:{
            type:Number,
            required:true
        },
        //free quantity
        ps_c:{
            type:Number,
            default:0
        },
    },{
        versionKey:false
    }
);

const medicineCategoryModel = model("medicineCategory", UserSchema);

export default medicineCategoryModel;