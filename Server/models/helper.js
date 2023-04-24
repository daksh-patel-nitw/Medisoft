const Mongoose =require('mongoose');

const Schema=Mongoose.Schema;
const UserSchema=new Schema(
    {   
        name:{
            type:String,
            required:true
        },
        content:{
            type:[Mongoose.Schema.Types.Mixed],
            required:true
        }
    },{
        versionKey:false
    }
);

const UserModel=Mongoose.model("Helper",UserSchema);

module.exports=UserModel;