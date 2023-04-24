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
        //type
        t:{
            type:String,
            required:true
        },
        //package_size
        ps:{
            type:String,
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
        }
    },{
        versionKey:false
    }
);

const UserModel=Mongoose.model("Medicine_name",UserSchema);

module.exports=UserModel;