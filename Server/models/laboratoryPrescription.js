import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const UserSchema = new Schema(
    {
        aid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "appointments",
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        tname: {
            type: String,
            required: true
        },
        //patients details range
        p_range: String,
        //normal range
        n_range: String,
        //what patient details are required
        pat_details: {
            type: String,
            required: true
        },
        //to get the patient details
        details: String,
        report: String,
        //status pending->billed->taken->done or cancel
        status: {
            type: String,
            enum: ['P', 'B', 'T', 'D', 'C'],
            default: 'P'
        },
        pid: {
            type: String,
            required: true
        },
    }, {
    versionKey: false,
    timestamps: true
}
);


const labPrescriptionModel = model("labPrescription", UserSchema);

export default labPrescriptionModel;