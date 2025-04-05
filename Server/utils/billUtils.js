import BillModel from '../models/bill.js';

const generateBill = async (price, aid, description, type, id, session) => {
  try {
    const billData = {
      aid,
      price,
      description,
      type,
      date: new Date(),
    };

    if (id) {
      billData.id = id;
    }
    const bill = new BillModel(billData);
    await bill.save({ session });
    // return bill;
  } catch (error) {
    console.error(error);
    throw new Error('Error generating bill');
  }
};

//This is for generating bill for direct sell of medicines, lab test and booking room without any doctor's prescription
export const generateOtherBill = async (name, pid, price, description, date = new Date()) => {
  try {
    const billData = {
      name,
      pid,
      price,
      description,
      type: 'other',
      date,
    };

    const bill = new BillModel(billData);
    await bill.save();

  } catch (error) {
    throw new Error('Error generating bill');
  }
}

export const confirmBill = async (flag, ids, aids, type, session) => {
  try {
    if (flag) {
      // console.log("In confirmBill", ids);
      await BillModel.updateMany(
            { _id: { $in: ids } },
            { $set: { status: true } },
            { session }
          );
    } else {
      await BillModel.updateMany(
        { type: type, _id: { $in: aids } },
        { $set: { status: true } },
        { session }
    );
    
    }
    console.log("Bills confirmed successfully");

  } catch (error) {
    console.error("Error in confirmBill:", error);
  }
}
export default generateBill;