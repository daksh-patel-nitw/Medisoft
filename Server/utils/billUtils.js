import BillModel from '../models/bill.js';

const generateBill = async(pid, price, aid, description, type, did = null , date = new Date()) => {
  try {
    const billData = {
      pid,
      aid,
      price,
      description,
      type,
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

//This is for generating bill for direct sell of medicines, lab test and booking room without any doctor's prescription
export const generateOtherBill= async(name,pid, price, description, date = new Date()) => {
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

export default generateBill;
