const Mongoose =require('mongoose');

const Schema=Mongoose.Schema;
const UserSchema=new Schema(
    {   
        did:String,
        date:String,
        timing:{
            type:String,
            required:true
        },
        count:{
            type:Number,
            required:true
        }
    },{
        versionKey:false,
        timestamps:true
    }
);

const UserModel=Mongoose.model("Timing",UserSchema);

module.exports=UserModel;