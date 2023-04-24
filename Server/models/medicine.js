const Mongoose =require('mongoose');

const Schema=Mongoose.Schema;
const UserSchema=new Schema(
    {   
        pid:{
            type:String,
            required:true
        },
        aid:{
            type:String,
            required:true
        },
        mname:{
            type:String,
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
        quantity:{
            type:Number,
            required:true
        },
        unit:{
            type:String,
            required:true
        },
        status:{
            type:String,
            default:'F'
        },price:{
            type:Number,
            required:true
        },
        date:{
            type:Date,
            required:true
        },
    },{
        versionKey:false,
        timestamps:true
    }
);

const UserModel=Mongoose.model("Medicine",UserSchema);

module.exports=UserModel;