const Mongoose =require('mongoose');

const Schema=Mongoose.Schema;
const UserSchema=new Schema(
    {   
        uname:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        type:{
            type:String,
            required:true
        }      
    },{
        versionKey:false
    }
);

const UserModel=Mongoose.model("login",UserSchema);

module.exports=UserModel;