import labModel from "../models/laboratoryInventory.js";
import labPrescriptionModel from "../models/laboratoryPrescription.js";
import generateBill from '../utils/billUtils.js';

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
    await newT.save();

    res.status(200).json(newT);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }

};

//update test detail
export const updateTest = async (req, res) => {
  const value = req.params.value;
  try {

    const doc = await labModel.findOneAndUpdate({ _id: req.body._id }, { useFindAndModify: false });
    console.log(doc);
    doc[value] = req.body[value];
    await doc.save();
    res.status(200).json(doc);

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

//delete test
export const deleteTest = async (req, res) => {
  try {
    const deletedMedicine = await t_n.findByIdAndDelete(id);
    res.status(200).json(`${deletedMedicine.mname} deleted successfully`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

//-----------------Tests-------------------------

//add Test from doctor
export const prescribeTest = async (req,res) => {
  try {

    const tests = req.body;
    tests.forEach(async (body) => {
      const newT = new labPrescriptionModel({
        did: tests.did,
        pid: tests.pid,
        aid: tests.aid,
        price: body.price,
        pname: tests.pname,
        pat_details: body.pat_details,
        tname: body.name,
        n_range: body.normal,
      })

      await newT.save();
    });

    res.status(200).json("Successfully prescribed Tests");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }

};

//Send All laboratory tests status 
export const getAllPrescribedTests = async (req,res) => {
  try {

    const allTests = await labPrescriptionModel.aggregate([
      {
        $facet: {
          pending: [{ $match: { details: "P" } }],
          intermediate: [{ $match: { details: "D", status: "F" } }],
          completed: [{ $match: { status: "D" } }]
        }
      }
    ]);
    
    // Output: { pending: [...], intermediate: [...], completed: [...] }
    console.log(allTests[0]); 
   
    res.status(200).json(arrTests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Take patient details
export const updatePatientDetails = async (req,res) => {
  try {

    const test = await test.findByIdAndUpdate(id, { details: 'D' }, { useFindAndModify: false });

    //When someone wants to do direct test without doctor
    const status=(req.params.type === 'out') ? false : true;

    const newBill = await generateBill(allT.pid, allT.price, allT.aid, allT.tname, 'lab', allT.did);
    console.log("Bill in Route:", newBill)

    res.status(200).json({ message: "Patient details updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// update the results of the test
export const updateTestResults = async (req,res) => {
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
