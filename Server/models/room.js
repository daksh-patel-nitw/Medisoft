const Mongoose =require('mongoose');

const Schema=Mongoose.Schema;
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
        dname:String,
        did:String,
        pid:String,
        aid:String,
        pname:String,
        date:{
            type:Date,
            default:Date.now
        },
        dname:String,
        mobile:Number,
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
    },{
        versionKey:false,
        timestamps:true
    }
);

const UserModel=Mongoose.model("room",UserSchema);

module.exports=UserModel;