import memberModel from "../models/people.js";
import { generateId } from '../utils/helperUtils.js';
import { getDocTimings } from "../services/getDoctorTimings.js";
import { getItem, updateHelper } from '../utils/helperUtils.js';
import { SignUp, deleteLogin } from '../utils/authData.js';

// -------------------------- Common --------------------------

//Add new Member
export const addMember = async (req, res) => {

    const body = req.body;
    console.log(body);

    try {

        const newM = new memberModel({
            fname: body.fname,
            middlename: body.middlename,
            lname: body.lname,
            mobile: body.mobile,
            email: body.email,
            dob: body.dob,
            address: body.address,
            city: body.city,
            pincode: body.pincode,
            gender: body.gender,
        });
        let id = "";
        if (body.type === 'patient') {
            id = 'P' + await generateId('pid');
            newM.allergy = body.allergy;
            newM.conditions = body.conditions;
            newM.others = body.others;
            newM.type = 'patient';
        } else {
            id = 'E' + await generateId('eid');
            newM.degree = body.degree;
            newM.college = body.college;
            newM.dep = body.dep;
            newM.type = 'employee';
        }
        newM.mid = id;
        newM.save();
        res.status(200).json({ id: id, message: `Successfully registered ${body.type}`, show: true });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//Get member with id
export const getMemberWithId = async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await memberModel.findOne({ mid: id }, {});
        res.status(200).json(employee);
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// -------------------------- Employee --------------------------


//Get the doctor for reception 1
export const getDoctorDetails = async (req, res) => {
    try {
        const newM = await memberModel.aggregate([
            { $match: { role: "doctor" } },
            {
                $project: {
                    dname: { $concat: ["$fname", " ", "$lname"] },
                    dep: 1,
                    eid: "$mid",
                    timings: 1,
                    qs: "$questions",
                    pph: 1,
                    price: 1
                }
            }
        ]);

        res.status(200).json(newM);
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getPatientNamesId = async (req, res) => {
    try {

        const newM = await memberModel.aggregate([
            { $match: { type: "patient" } },
            {
                $project: {
                    pname: { $concat: ["$fname", " ", "$lname"] },
                    pid: "$mid",
                    mobile: 1
                }
            }
        ]);

        res.status(200).json(newM);
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Upodate the role of the employee in the admin panel
export const updateRole = async (req, res) => {
    try {
        const { eid, name, role, dep, mobile } = req.body;

        console.log(req.body);
        const result = await memberModel.findOneAndUpdate({ mid: eid }, { role: role }, { new: true });
        if (!result) {
            return res.status(404).json({ message: "Member not found" });
        }
        console.log(result);
        //making the login of the employee with his mobile number as password
        const newLogin = await SignUp(eid, name, role, mobile, mobile, dep);

        console.log(newLogin);

        res.status(200).json({ message: 'Successfully assigned the role', show: true });
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

//delete the panel of the employee in the admin panel
export const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(req.body);
        const result = await memberModel.findOneAndUpdate(
            { mid: id },
            { $unset: { role: 1 } },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ message: "Member not found" });
        }
        console.log(result);

        const newLogin = await deleteLogin(id);

        console.log(newLogin);

        res.status(200).json({ message: 'Successfully Deleted the role', show: true });
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

//get the doctor timings for booking appointment on reception 1 as the user selects the date.
export const getDoctortimings = async (req, res) => {
    const { date, did } = req.params;
    try {
        const result = await getDocTimings(did, date);
        console.log(result);
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

//get Doctor for QueueScreen
export const getDoctorByDepartment = async (req, res) => {
    const { dep } = req.params;
    try {
        const newM = await memberModel.aggregate([
            { $match: { role: "doctor", dep: dep } },
            {
                $project: {
                    dname: { $concat: ["$fname", " ", "$lname"] },
                    eid: "$mid",
                }
            }
        ]);
        res.status(200).json(newM);
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

//update the member details
export const updateMember = async (mid,updateFields) => {
    if (!mid || Object.keys(updateFields).length === 0) {
        console.error('Invalid request. Provide mid and at least one field to update.');
        throw new Error('Invalid request. Provide mid and at least one field to update.');
    }

    try {
        const result = await memberModel.findOneAndUpdate(
            { mid },
            { $set: updateFields },
            { new: true }
        );

        if (!result) {
            console.error('Doctor not found');
            throw new Error('Doctor not found');
        }
        return result;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

//add doctor timings
export const updateDoctorDetails = async (req, res) => {
    const { mid, ...updateFields } = req.body;
    console.log(req.body);
    try {
        const result=await updateMember(mid, updateFields);

        res.status(200).json({ message: "Update Successfull", show: true, data: result });

    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

//--------------------------- Admin ---------------------------

//get roles and departments for admin
export const getRolesDeps = async (req, res) => {
    const { option } = req.params;
    try {
        const deps = await getItem('dep');
        if (option === 'onlyDeps') {
            return res.status(200).json(deps['content']);
        }
        const roles = await getItem('roles');

        res.status(200).json([roles['content'], deps['content']]);
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
}


//update the roles or departments of the employee for the admin panel
export const updateRoleDeps = async (req, res) => {

    try {

        const { name, data } = req.body;
        console.log(name, data);
        const result = await updateHelper(name, data);
        if (!result) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.status(200).json({ message: `Successfully updated the ${name}`, show: true, data: result });
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
//Employee data for admin
export const getAdminEmployee = async (req, res) => {
    try {
        const newM = await memberModel.aggregate([
            { $match: { type: "employee" } },
            {
                $project: {
                    eid: "$mid",
                    mobile: 1,
                    dep: 1,
                    role: 1,
                    name: { $concat: ['$fname', ' ', '$lname'] }
                }
            },
            {
                $facet: {
                    newM1: [{ $match: { role: { $exists: false } } }],  // No 'role' field
                    newM2: [{ $match: { role: { $exists: true } } }]   // 'role' field exists
                }
            }
        ]);

        const { newM1, newM2 } = newM[0];


        const roles = await getItem('roles');
        res.status(200).json([newM1, newM2, roles.content]);
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

// -------------------------- Patient --------------------------

//get all Patients
export const getAllPatients = async (req, res) => {
    try {
        const result = await memberModel.find({ type: "patient" });
        res.status(200).json(result);

    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
}