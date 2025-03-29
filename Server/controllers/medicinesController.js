import medicineModel from '../models/medicineInventory.js';
import prescriptionModel from '../models/medicinePrescription.js';
import { groupByValueMedicines } from '../utils/groupByValue.js';
import generateBill from '../utils/billUtils.js';
import { getItem, updateOnlyContentHelper, removeContentHelper } from '../utils/helperUtils.js';


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
    res.status(200).json({ message: "Successfully Added the medicine.", show: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

//Get all medicine categories
export const getMedicineCategories = async (req, res) => {
  try {
    const allCategories = await getItem("medicineType");
    res.status(200).json(allCategories.content);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
}

//Updating or deleting medicine categories
export const updateMedicineCategories = async (req, res) => {
  const { value, flag } = req.body;
  try {
    if (flag) {
      const allCategories = await updateOnlyContentHelper("medicineType", value);
    } else {
      const allCategories = await removeContentHelper("medicineType", value);
    }
    res.status(200).json({ message: `Successfully ${flag ? "added" : "deleted"} the ${value} category.`, show: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
}

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
// export const getAllMedicines = async (req, res) => {
//   try {
//     const allMedicines = await medicineModel.find().lean();
//     res.status(200).json(allMedicines);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Internal Server Error." });
//   }
// };

//Send all medicines to the pharmacy with pagination
export const getAllMedicines = async (req, res) => {
  try {
    let { page = 1, limit = 10, query = "" } = req.query; // Default page=1, limit=10
    page = parseInt(page);
    limit = parseInt(limit);

    // Build search filter
    const filter = query
      ? { name: { $regex: query, $options: "i" } } // Case-insensitive search for name
      : {}; // No filter if query is empty

    const totalMedicines = await medicineModel.countDocuments(filter); // Get total count based on filter
    const allMedicines = await medicineModel
      .find(filter)
      .skip((page - 1) * limit) // Skip previous pages
      .limit(limit) // Limit results per page
      .lean();

    res.status(200).json({
      medicines: allMedicines,
      totalPages: Math.ceil(totalMedicines / limit), // Calculate total pages
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error." });
  }
};


//filter the medicine name in the pharmacy
export const filterMedicine = async (req, res) => {
  const { query } = req.query;
  if (!query || query.length < 3) {
    return res.json({ medicines: [] });
  }

  try {
    let medicinesQuery = medicineModel.find({
      name: { $regex: query, $options: 'i' }
    });

    if (query.length <= 8) {
      medicinesQuery = medicinesQuery.limit(15);
    }

    const medicines = await medicinesQuery;

    console.log(medicines);
    res.status(200).json(medicines);
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

//Sending the Previous appointment medicines to OPD and IPD doctor
export const getMedicine = async (aid, index) => {
  try {
    
    if (index === 1)
      return await prescriptionModel.find({  });
    else {
      console.log("In getMedicine", aid);
      return await prescriptionModel.aggregate([
        { $match: { aid:aid } },
        {
          $group: {
            _id: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt", timezone: "Asia/Kolkata"  } },
            medicines: { 
              $push: { 
                name: "$mname", 
                time: "$time", 
              } 
            }
          }
        },
        { $sort: { "_id": -1 } },
        {
          $project: {
            date: "$_id",
            medicines: 1,
            _id: 0
          }
        }
    ]);
    

    }
  } catch (error) {
    console.error("Error in getMedicine:", error);
    return null;
  }
}

//Add new prescription
export const prescribeMedicine = async (aid, medicines, session) => {
  console.log("In medicines")
  try {
    for (const m of medicines) {
      const b = await medicineModel.findById(m._id).session(session);
      const quantity = Number(m.ps_c) + Number(b.ps) * Number(m.ps_u);
      const newM = new prescriptionModel({
        aid: aid,
        mname: b.name,
        quantity,
        ps: b.ps,
        price: b.price * quantity,
        time: m.time.join(',')
      });

      await newM.save({ session });
    }
    return true;
  } catch (error) {
    console.error("Error in prescribeMedicine:", error);
    return false;
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


