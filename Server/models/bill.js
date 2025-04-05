import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const BillSchema = new Schema(
  {
    name:String,
    
    aid: { type: mongoose.Schema.Types.ObjectId, ref: "appointment" },
    id: { type: mongoose.Schema.Types.ObjectId },
    date: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['pharmacy', 'doctor', 'lab','room','other'],
    },
    status: {
      type: Boolean,
      default: false,
    },
    billed_date:Date,
  },
  {
    versionKey: false,
  }
);

const BillModel = model('Bill', BillSchema);

export default BillModel;
