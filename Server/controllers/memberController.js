import memberModel from "../models/people.js";
import { generateId } from '../utils/helperUtils.js';
import { getDocTimings } from "../services/getDoctorTimings.js";

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
        const employee = await memberModel.findOne({ mid: id });
        res.status(200).send(employee);
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// -------------------------- Employee --------------------------


//Get the doctor for reception 1
export const getDoctorDetails = async (req, res) => {
    try {
        const newM = await memberModel.aggregate([
            { $match: { "role": "doctor" } },
            {
                $project: {
                    "dname": { $concat: ["$fname", " ", "$lname"] },
                    "dep": 1,
                    "eid": "$mid",
                    "timings": 1,
                    "qs": "$questions",
                    "pph": 1
                }
            }
        ]);

        res.status(200).json(newM);
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getPatientNamesId=async(req,res)=>{
    try {
        
        const newM = await memberModel.aggregate([
            { $match: { type: "patient" } },
            {
                $project: {
                    pname: { $concat: ["$fname", " ", "$lname"] },
                    pid: "$mid",
                    mobile:1
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
        const { id, role } = req.body;

        const result = await memberModel.findOneAndUpdate({ mid: id }, { role: role }, { new: true });
        if (!result) {
            return res.status(404).json({ message: "Member not found" });
        }
        // console.log(result);
        res.status(200).json({ message: 'Successfully assigned the role', show: true });
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

//add doctor timings
export const addDoctorTimings = async (req, res) => {
    const body = req.body;
    try {
        const result = await memberModel.findOneAndUpdate({ mid: body.eid }, { $set: { timings: body.timings } }, { new: true });
        res.status(200).send(result);
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
                    mid: 1,
                    mobile: 1,
                    dep: 1,
                    role: 1,
                    name: {
                        $concat: ['$fname', ' ', '$lname']
                    }
                }
            }
        ]);
        res.status(200).json(newM);
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