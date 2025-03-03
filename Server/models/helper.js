import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const UserSchema=new Schema(
    {   
        name:{
            type:String,
            required:true
        },
        content:{
            type:[mongoose.Schema.Types.Mixed],
            required:true
        }
    },{
        versionKey:false
    }
);

const helperModel = model("helper", UserSchema);

export default helperModel;