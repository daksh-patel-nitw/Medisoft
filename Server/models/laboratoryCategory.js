const Mongoose =require('mongoose');

const Schema=Mongoose.Schema;
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
        pat_details:{
            type:String,
            required:true
        },
        normal:{
            type:String,
            required:true
        },
        timing:Array,

    },{
        versionKey:false
    }
);

const UserModel=Mongoose.model("Test_name",UserSchema);

module.exports=UserModel;