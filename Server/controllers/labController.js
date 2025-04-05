import labModel from "../models/laboratoryInventory.js";
import labPrescriptionModel from "../models/laboratoryPrescription.js";
import generateBill,{confirmBill} from '../utils/billUtils.js';

//------------LABORATORY Inventory -------------------

//Add new test for Hospital
export const addNewTest = async (req, res) => {
  const body = req.body;
  try {
    const newT = new labModel({
      name: body.name,
      price: body.price,
      pat_details: body.pat_details,
      normal: body.normal
    })

    if (body.timing)
      newT.timing = body.timing;
    await newT.save();

    res.status(200).json({ message: "Test added successfully", show: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }

};

//update test detail
export const updateTest = async (req, res) => {
  const { column, id, value } = req.body;
  try {

    const doc = await labModel.findOneAndUpdate({ _id: id }, { useFindAndModify: false });
    doc[column] = value;
    await doc.save();
    res.status(200).json({ message: "Test updated successfully", show: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Get all the lab-tests
export const getAllTests = async (req, res) => {
  try {
    const allTests = await labModel.find().lean();
    res.status(200).json(allTests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Get all the lab-tests
export const getAllTestsforDScreen = async (req, res) => {
  try {
    const allTests = await labModel.find({}, { _id: 1, name: 1 });
    res.status(200).json(allTests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//delete test
export const deleteTest = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedMedicine = await labModel.findByIdAndDelete(id);
    res.status(200).json({ message: `${deletedMedicine.name} deleted successfully`, show: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

//-----------------Tests-------------------------

//Send All laboratory tests status 
export const getAllPrescribedTests = async (req, res) => {
  const {pid}=req.body;
  try {
    const tests = await labPrescriptionModel.aggregate([
          { $match: { pid ,status:"B"} }, // Filter by patient id
          {
            $group: {
              _id: "$aid",
              tests: { $push: "$$ROOT" }
            }
          },
          {
            $project: {
              _id: 0,
              aid: "$_id",
              tests: 1
            }
          }
        ]);
    
        res.status(200).json(tests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Take patient details
export const updatePatientDetails = async (req, res) => {
  try {

    const test = await test.findByIdAndUpdate(id, { details: 'D' }, { useFindAndModify: false });

    //When someone wants to do direct test without doctor
    const status = (req.params.type === 'out') ? false : true;

    const newBill = await generateBill(allT.pid, allT.price, allT.aid, allT.tname, 'lab', allT.did);
    console.log("Bill in Route:", newBill)

    res.status(200).json({ message: "Patient details updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// update the results of the test
export const updateTestResults = async (req, res) => {
  try {

    const allT = await test.findByIdAndUpdate(
      req.params.id,
      { p_range: req.params.value, status: 'D' },
      { new: true, useFindAndModify: false }
    );

    res.status(200).json(allT);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//-------------------- Exporting the functions for other files -------------------

//Sending the Previous appointment tests to OPD and IPD doctor
export const getTests = async (aid, index) => {
  try {
    if (index === 1)
      return await labPrescriptionModel.find({ aid });
    else {
      return await labPrescriptionModel.aggregate([
        { $match: { aid: aid } },
        {
          $group: {
            _id: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt", timezone: "Asia/Kolkata"  } },
            tests: { $push: {name:"$tname"} }
          }
        },
        { $sort: { "_id": -1 } },
        {
          $project: {
            date: "$_id",
            tests: 1,
            _id: 0
          }
        }
      ]);
    }
  } catch (err) {
    console.error(err);
    return false;
  }
}

//add Test from doctor
export const prescribeTest = async (aid, tests, session) => {
  console.log("In Tests")
  try {
    for (const body of tests) {
      const { price, pat_details, name, normal } = await labModel.findById(body._id).session(session);
      const newT = new labPrescriptionModel({
        aid,
        price,
        pat_details,
        tname: name,
        n_range: normal,
      });
      await generateBill(price, aid, name, "lab",newT._id, session);
      await newT.save({ session });
    }
    return true;
  } catch (error) {
    console.error("Error in prescribeTest:", error);
    return false;
  }
};


//confirm the bill of the test
export const confirmBillLab = async (arr,session) => {
  try {
    console.log("In Confirm Bill", arr);

    //Extracting the ids from the array of objects
    const idsToUpdate = arr.map(item => item.id);
    const idsForConfirm = arr.map(item => item._id);

    //Updating the status of the medicines in the prescription model
    await labPrescriptionModel.updateMany(
      { _id: { $in: idsToUpdate } },
      { $set: { status: "B" } },
      { session }
    );

    //Updating the status of the bills in the bill model
    await confirmBill(1, idsForConfirm, null, null, session);

    console.log("Transaction committed successfully in lab");

  } catch (error) {
    console.error("Transaction rolled back:", error);
    return false;
  }
};