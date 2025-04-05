import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const medicinePrescriptionSchema = new Schema(
    {
        aid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "appointments",
            required: true
        },
        pid:{
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        mname: {
            type: String,
            required: true
        },
        ps:Number,
        quantity: {
            type: Number,
            required: true
        },
        //status pending->billed->done or cancel
        status: {
            type: String,
            enum: ['P','B','D','C'],
            default: 'P'
        },
        //time string will be of comma separated: breakfast, lunch, Snaks, dinner, 1 time a day
        // all will be prefixed with before and after
        //eg:For after lunch and after dinner: "AL,AD"
        time:{
            type:String,
            required:true
        }

    }, {
    versionKey: false,
    timestamps: true
}
);

const medicinePrescriptionModel = model("medicinePrescription", medicinePrescriptionSchema);

export default medicinePrescriptionModel;