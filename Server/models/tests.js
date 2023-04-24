const Mongoose =require('mongoose');

const Schema=Mongoose.Schema;
const UserSchema=new Schema(
    {   
        aid:{
            type:String,
            required:true
        },
        did:{
            type:String,
            required:true
        },
        pid:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        pname:{
            type:String,
            required:true
        },
        tname:{
            type:String,
            required:true
        },
        p_range:String,
        n_range:String,
        pat_details:{
            type:String,
            required:true
        },
        details:{
            type:String,
            default:'P'
        },
        report:String,
        status:{
            type:String,
            default:'F'
        }, date:{
            type:Date,
            required:true
        },
    },{
        versionKey:false,
        timestamps:true
    }
);


const UserModel=Mongoose.model("Test",UserSchema);

module.exports=UserModel;