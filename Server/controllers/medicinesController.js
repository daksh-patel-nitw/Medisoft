import medicineModel from '../models/medicineInventory.js';
import prescriptionModel from '../models/medicinePrescription.js';
import { groupByValueMedicines } from '../utils/groupByValue.js';
import generateBill from '../utils/billUtils.js';


// ===========================Medicine_Name=========================

//Add new medicine
export const addNewMedicine = async (req, res) => {
  const b = req.body;
  try {
    const newM = new medicineModel({
      name: b.name + " " + b.q,
      price: b.price,
      t: b.t,
      ps: b.ps,
      ps_u: b.ps_u
    })
    await newM.save();
    res.status(200).json(newM);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

//Send all medicine to doctor
export const getMedicineDoctor = async (req, res) => {
  try {
    const allT = await medicineModel.find({}, { name: 1, ps: 1, t: 1, price: 1 });

    res.status(200).json(allT);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

//Send all mediciene to pharmacy
export const getAllMedicines = async (req, res) => {
  try {
    const allMedicines = await medicineModel.find().lean();
    res.status(200).json(allMedicines);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

//update medicine detail
export const updateMedicine = async (req, res) => {
  const body = req.body;
  const value = req.params.value;
  const name_ = body._id;

  // console.log(name_,value,req.body[value]);
  try {
    const doc = await medicineModel.findOneAndUpdate({ _id: name_ }, { useFindAndModify: false });
    console.log(doc);
    if (value === "ps_u") {
      sum = parseInt(doc['ps_u']);
      sum = sum + parseInt(body[value]);
      doc.ps_u = sum;

    } else {
      doc[value] = body[value];
    }
    await doc.save();
    console.log(doc);
    res.status(200).json(doc);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

//delete medicine
export const deleteMedicine = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedMedicine = await medicineModel.findByIdAndDelete(id);
    res.status(200).json(deletedMedicine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

//------------------------------Medicines----------------------

//Add new prescription
export const addNewPrescription = async (req, res) => {

  const b = req.body;
  try {

    const newM = new prescriptionModel({
      pid: b.pid,
      aid: b.aid,
      mname: b.mname,
      pname: b.pname,
      did: b.did,
      quantity: (Number(b.ps_c) + (Number(b.ps) * Number(b.ps_u))),
      unit: b.unit,
      price: b.price,
      status: 'P'
    })
    if (b.status) {
      newM.status = b.status;
    }

    await newM.save();
    console.log(newM);

    res.status(200).json(newM);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

//Get all prescriptions medicines
export const getAllPrescriptions = async (req, res) => {
  try {
    const data = await prescriptionModel.find().lean();
    const fieldsToExtract = ["pid", "aid", "pname", "did"];
    const grouped = groupByValueMedicines(data, "aid", fieldsToExtract);
    res.status(200).json(grouped);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

//Sell Medicine to Customer
export const sellMedicine = async (req, res) => {
  const data = req.body;

  try {
    let amount = 0;
    console.log(data);
    //Get All the medicines and update the status
    await Promise.all(data.Medicines.map(async (m) => {

      // update the Medicine Status
      await prescriptionModel.findOneAndUpdate(
        { aid: data.aid },
        { status: m.status },
        { useFindAndModify: false }
      );

      if (m.status === "D") {
        //Adding to total amount
        amount += m.price * m.quantity;
        
        // Generate bill only for "D" status medicines
        await generateBill(data.pid, m.price, data.aid, m.mname, "pharmacy", data.did);
      }
    }));

    res.status(200).json({ message: `${amount}₹ added to bills.` });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Cant Add Amount to bills." });
  }
};


