import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const UserSchema = new Schema(
    {
        pid: {
            type: String,
            required: true
        },
        aid: {
            type: String,
            required: true
        },
        mname: {
            type: String,
            required: true
        },
        pname: {
            type: String,
            required: true
        },
        did: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: 'F'
        }, 
        price: {
            type: Number,
            required: true
        },
    }, {
    versionKey: false,
    timestamps: true
}
);

const medicinePrescriptionModel = mongoose.model("medicinePrescription", UserSchema);

export default medicinePrescriptionModel;