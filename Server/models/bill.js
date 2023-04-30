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
        date:{
            type:Date,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        type:{
            type:String,
            required:true
        },
        did:String,
        status:{
            type:Boolean,
            default:false
        },
       
    },{
        versionKey:false
    }
);


const UserModel=Mongoose.model("Bill",UserSchema);

module.exports=UserModel;