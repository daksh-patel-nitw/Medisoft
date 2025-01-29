import BillModel from '../models/bill';

export const generateBill = async (pid, price, aid, description, type, status = false, date = new Date(), did = null) => {
  try {
    const billData = {
      pid,
      aid,
      price,
      description,
      type,
      status,
      date,
    };

    if (did) {
      billData.did = did;
    }

    const bill = new BillModel(billData);
    await bill.save();
    
  } catch (error) {
    throw new Error('Error generating bill');
  }
};


