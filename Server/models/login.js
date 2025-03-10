import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const UserSchema = new Schema(
    {   
        mid:{
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        panel: String,
        dep: String,
        security_phrase:String,
    },
    {
        versionKey: false
    }
);

const loginModel = model("login", UserSchema);

export default loginModel;
