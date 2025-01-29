
import medicineInventoryModel from '../models/medicineInventory';
import medicinePrescriptionModel from '../models/medicinePrescription';
import {generateBill} from '../utilities/billUtils';

// ===========================Medicine_Inventory=========================

import medicineInventoryModel from '../models/medicineInventory';

// 1. Add new medicine
export const addNewMedicine = async (req, res) => {
  try {
    const { name, price, t, ps, ps_u, q } = req.body;

    const newMedicine = new medicineInventoryModel({
      name: name + " " + q,  // Concatenate name with quantity
      price,
      t,
      ps,
      ps_u
    });

    await newMedicine.save();
    return res.status(201).json(newMedicine);
  } catch (error) {
    return res.status(500).json({ error: 'Error creating new medicine' });
  }
};

// 2. Get all medicines for the doctor (only relevant fields)
export const getMedicinesForDoctor = async (req, res) => {
  try {
    const allMedicines = await medicineInventoryModel.find({}, { name: 1, ps: 1, t: 1, price: 1 });
    return res.status(200).json(allMedicines);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching medicines for doctor' });
  }
};

// 3. Get all medicines for pharmacy
export const getAllMedicines = async (req, res) => {
  try {
    const allMedicines = await medicineInventoryModel.find();
    return res.status(200).json(allMedicines);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
};

// 4. Update medicine details
export const updateMedicineDetails = async (req, res) => {
  const { _id, value } = req.body;
  const field = req.params.value;

  try {
    const doc = await medicineInventoryModel.findOne({ _id });

    if (!doc) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    if (field === "ps_u") {
      let sum = parseInt(doc['ps_u']);
      sum = sum + parseInt(req.body[value]);
      doc.ps_u = sum;
    } else {
      doc[field] = req.body[value];
    }

    await doc.save();  // Save the updated document
    return res.status(200).json(doc);  // Respond with the updated document
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

// 5. Delete medicine
export const deleteMedicine = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMedicine = await medicineInventoryModel.findByIdAndDelete(id);
    if (!deletedMedicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    return res.status(200).json({ message: 'Medicine deleted successfully', deletedMedicine });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting medicine' });
  }
};

//------------------------------Medicine_Prescription----------------------

// Add a new medicine prescription
export const addMedicinePrescription = async (req, res) => {
  const { pid, aid, name, pname, did, ps_c, ps, ps_u, t, price, date } = req.body;
  console.log(req.body);

  const newMedicine = new medicinePrescriptionModel({
    pid,
    aid,
    mname: `${name} ${ps_c}`,
    pname,
    did,
    quantity: (Number(ps_c) + (Number(ps) * Number(ps_u))),
    unit: t,
    price,
    date,
  });

  await newMedicine.save();
  console.log(newMedicine);
  return res.json(newMedicine);
};

// Get all medicines by their status (Fresh or Discontinued)
export const getMedicinesByStatus = async (req, res) => {
  try {
    const allMedicines = await medicinePrescriptionModel.find();

    const freshMedicines = [];
    const discontinuedMedicines = [];

    allMedicines.forEach(medicine => {
      if (medicine.status === 'F') {
        freshMedicines.push(medicine);
      } else if (medicine.status === 'D') {
        discontinuedMedicines.push(medicine);
      }
    });

    // Now, freshMedicines and discontinuedMedicines contain the separated medicines.

    const medicinesByStatus = [[...freshMedicines], [...discontinuedMedicines]];
    return res.json(medicinesByStatus);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Complete the medicine process (Update status, adjust inventory, and generate a bill)
export const completeMedicinePrescription = async (req, res) => {
  try {
    const data = req.body;
    const totalAmount = data.pop(); // Assuming last item is total price
    const description = data.pop(); // Assuming second last item is description
    console.log("After Slice data", data);

    // Update each medicine and adjust inventory
    for (const medicineData of data) {
      const updatedMedicine = await medicinePrescriptionModel.findByIdAndUpdate(
        medicineData._id,
        { status: 'D' },
        { new: true }
      );
      console.log("Updated medicine", updatedMedicine);

      // Adjust inventory
      const medicineInventory = await medicineInventoryModel.findOne({
        name: medicineData.mname,
        t: medicineData.unit,
      });
      console.log("Medicine Inventory:", medicineInventory);

      medicineInventory.ps_u -= Math.floor(medicineData.quantity / Number(medicineInventory.ps));
      medicineInventory.ps_c += (medicineData.quantity % Number(medicineInventory.ps));
      await medicineInventory.save();
      console.log("Updated Medicine Inventory:", medicineInventory);
      
      await generateBill(
        medicineData.pid,
        medicineData.price,
        medicineData.aid,
        medicineData.mname,
        "medicine",
        true,
        medicineData.createdAt,
        medicineData.did
      );

    }

    return res.status(200);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};



module.exports = router;