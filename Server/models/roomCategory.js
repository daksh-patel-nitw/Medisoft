const Mongoose =require('mongoose');

const Schema=Mongoose.Schema;
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

const UserModel=Mongoose.model("room_category",UserSchema);

module.exports=UserModel;