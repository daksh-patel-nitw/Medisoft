import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const UserSchema = new Schema(
    {   
        mId:{
            type: String,
            required: true
        },
        uname: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        type: String,
        dep: String,
        security_phrase:String,
    },
    {
        versionKey: false
    }
);

const loginModel = model("login", UserSchema);

export default loginModel;
