import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const BillSchema = new Schema(
  {
    name:String,
    pid: {
      type: String,
      required: true,
    },
    aid: String,
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
    did: String,
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
  }
);

const BillModel = model('Bill', BillSchema);

export default BillModel;
