import {m_n} from '../models/medicine_name.js';
import {t_n} from '../models/test_name.js';
import {test} from '../models/tests.js';
import {medicine} from '../models/medicine.js';
import {completedLabTest} from './appointment.js';

// ===========================Medicine_Name=========================

//Add new medicine
export const newmedicine = async (b) => {
  try {
    const newM = new m_n({
      name: b.name + " " + b.q,
      price: b.price,
      t: b.t,
      ps: b.ps,
      ps_u: b.ps_u
    })
    await newM.save();
    return (newM);
  } catch (error) {
    console.log(error);
    return null
  }
};

//Send all medicine to doctor
export const getmedicinedoctor = async () => {
  try {
    const allT = await m_n.find({}, { name: 1, ps: 1, t: 1, price: 1 });
    return (allT);
  } catch (error) {
    console.log(error);
    return null
  }
};

//Send all mediciene to pharmacy
export const allmedicines = async () => {
  try {
    const allMedicines = await m_n.find();
    return (allMedicines);
  } catch (err) {
    console.log(err);
    return null;
  }
};

//update medicine detail
export const updatemedicine = async (body, value) => {
  const name_ = body._id;

  // console.log(name_,value,req.body[value]);
  try {
    const doc = await m_n.findOneAndUpdate({ _id: name_ }, { useFindAndModify: false });
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
    return ((doc));
  } catch (error) {
    console.log(error);
    return null;
  }
};

//delete medicine
export const deletemedicine = async (id) => {
  try {
    const deletedMedicine = await m_n.findByIdAndDelete(id);
    return deletedMedicine;
  } catch (error) {
    console.error(error);
    return null;
  }
};

//------------------------------Medicines----------------------

export const addnewm = async (b) => {
  // console.log(b);

  try {

    const newM = new medicine({
      pid: b.pid,
      aid: b.aid,
      mname: b.name,
      pname: b.pname,
      did: b.did,
      quantity: (Number(b.ps_c) + (Number(b.ps) * Number(b.ps_u))),
      unit: b.t,
      price: b.price,
      date: b.date,
    })
    await newM.save();
    console.log(newM);

    return (newM);
  } catch (error) {
    console.log(error);
    return null
  }
};

//Get medicines
export const getmedicines = async () => {
  try {
    const allT = await medicine.find({ status: 'F' });
    const allT1 = await medicine.find({ status: 'D' });
    arr = [[...allT], [...allT1]]
    return (arr);
  } catch (error) {
    console.log(error);
    return null;
  }
};

//Finish medicine
export const finishmedopd = async (data) => {
  try {
    const priceTotal = data.pop();
    const des = data.pop();
    console.log("After Slice data", data);
    data.forEach(async (m, index) => {
      const update = await medicine.findByIdAndUpdate(m._id, { status: 'D' }, { new: true });
      console.log("Updating medicine ", index, update);

      const med = await m_n.findOne({ name: m.mname, t: m.unit });
      console.log("Medicine:", index, med)
      med.ps_u = med.ps_u - Math.floor(m.quantity / Number(med.ps));
      med.ps_c = med.ps_c + (m.quantity % Number(med.ps));
      await med.save();
      console.log("Medicine After:", med)
    });
    console.log(data[0]);
    const newBill = await generateBill(data[0].pid, priceTotal, data[0].aid, des, "medicine", true, data[0].createdAt);
    console.log("Bill in Route:", newBill)
    // pid,price,aid,des,type,status,date
    return ({ update: newBill });
  } catch (error) {
    console.error(error);
    return null;
  }
};

//-------------------------------LABORATORY-----------------------------------------

//Add test
export const newtest = async (body) => {
  try {
    const newT = new t_n({
      name: body.name,
      price: body.price,
      pat_details: body.pat_details,
      normal: body.normal
    })

    await newT.save();
    return (newT);
  } catch (error) {
    console.log(error);
    return null
  }

};

//update test detail
export const updatetest = async (name_, value) => {
  try {
    const doc = await t_n.findOneAndUpdate({ _id: name_ }, { useFindAndModify: false });
    console.log(doc);
    doc[value] = req.body[value];

    await doc.save();
    console.log(doc);
    return ((doc));
  } catch (error) {
    console.log(error);
    return null;
  }
};

//Get all the lab-tests
export const alltest = async () => {
  try {
    const allMedicines = await t_n.find();
    return (allMedicines);
  } catch (err) {
    console.error(err);
    return null;
  }
};

//delete test
export const deletetest = async (id) => {
  try {
    const deletedMedicine = await t_n.findByIdAndDelete(id);
    return deletedMedicine;
  } catch (error) {
    console.error(error);
    return null;
  }
}

//-----------------Tests-------------------------

//add Test from doctor
export const newpatienttest = async (body) => {
  try {

    const newT = new test({
      did: body.did,
      pid: body.pid,
      aid: body.aid,
      price: body.price,
      pname: body.pname,
      pat_details: body.pat_details,
      tname: body.name,
      n_range: body.normal,
      date: body.date,
    })

    await newT.save();
    console.log(newT);
    return (newT);
  } catch (error) {
    console.log(error);
    return null
  }

};

//Send All laboratory tests status 
export const getlabtests = async () => {
  try {

    const allT = await test.find({ details: 'P' });
    const allT1 = await test.find({ details: 'D', status: 'F' });
    const allT2 = await test.find({ status: 'D' });
    const arr1 = [[...allT], [...allT1], [...allT2]];
    // console.log(allT1);
    return (arr1);
  } catch (error) {
    console.log(error);
    return null
  }
};

//Update patient details
export const updatedetails = async (id) => {
  try {

    const allT = await test.findByIdAndUpdate(id, { details: 'D' }, { useFindAndModify: false });
    const status = allT.patStatus === 'IPD' ? false : true;

    const des = `<table style='width: 100%; border-collapse: collapse;'>
          <tr><th style='border: 1px solid black; padding: 5px;'>Description</th><th style='border: 1px solid black; padding: 5px;'>Quantity</th><th style='border: 1px solid black; padding: 5px;'>Price</th></tr><tr><td style='border: 1px solid black; padding: 5px;'>${allT.tname}</td><td style='border: 1px solid black; padding: 5px;'>1</td><td style='border: 1px solid black; padding: 5px;'>${allT.price}</td></tr></table><h2>Total: ${allT.price}</h2>`;

    const newBill = await generateBill(allT.pid, allT.price, allT.aid, des, 'Lab', status, allT.createdAt);
    console.log("Bill in Route:", newBill)

    return (allT);
  } catch (error) {
    console.log(error);
    return null
  }
};

// Finish the test 
export const donetest = async (value) => {
  try {
    const allT = await test.findByIdAndUpdate(
      req.params.id,
      { p_range: value, status: 'D' },
      { new: true, useFindAndModify: false }
    );
    console.log('test:', allT);
    const p = await completedLabTest();
    console.log(p);
    return ({ updatedTest: allT, newapp: p });
  } catch (error) {
    console.error(error);
    return null;
  }
};
