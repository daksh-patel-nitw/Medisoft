import helper from '../models/helper.js';

//--------------------------------Helper-------------------------------------

// Update Any helper
export const updateHelper = async (name, content) => {
  const doc = await helper.updateOne({ name }, { $set: { content } });
  return doc;
};

//optimized the updation procees of the content
export const updateOnlyContentHelper = async (name, value) => {
  const doc = await helper.findOneAndUpdate(
    { name }, 
    { $push: { content: value } },
    { new: true } 
  );
  return true;
};

//optimized the deletion procees of the content
export const removeContentHelper = async (name, value) => {
  const doc = await helper.findOneAndUpdate(
    { name }, 
    { $pull: { content: value } },
    { new: true }
  );
  return false;
};


//generate Id
export const generateId = async (item) => {
  const number = await helper.findOneAndUpdate(
    { name: item },
    { $inc: { "content.0": 1 } },
    { new: true, useFindAndModify: false }
  );

  const base36 = number.content[0].toString(36).toUpperCase();
  const padded = base36.padStart(7, '0');
  console.log(padded);
  return padded;
};

// Send document
export const getItem = async (name) => {
  const doc = await helper.findOne({ name });
  return doc;
};


const data={
  "medicine_type": [
    "Tablet",
    "Capsule",
    "Pill",
    "Powder",
    "Drops",
    "Injection",
    "Cream",
    "Ointment",
    "Gel",
    "Lotion",
    "Paste",
    "Dry Powder Inhaler (DPI)",
    "Sublingual Tablet"
  ]
}
