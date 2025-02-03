import memberModel from "../models/people.js";
import { generateId } from '../utils/helperUtils.js';
import {getDocTimings} from "../utils/getDoctorTimings.js";

// -------------------------- Common --------------------------

//Add new Member
export const addMember = async (req, res) => {
    const { type } = req.params;
    const body = req.body;

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
        if (type === 'patient') {
            id = 'P' + await generateId('pid');
            newM.weight = body.weight;
            newM.height = body.height;
            newM.allergy = body.allergy;
            newM.conditions = body.conditions;
            newM.others = body.others;
            newM.type = 'patient';
        } else {
            id = 'E' + await generateId('eid');
            newM.degree = body.degree;
            newM.college = body.college;
            newM.role = body.role;
            newM.dep = body.dep;
            newM.type = 'employee';
        }
        newM.mid = id;
        newM.save();
        res.status(200).send(newM);
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

//Get member with id
export const getEmployeeWithId = async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await memberModel.findOne({ mid: id });
        res.status(200).send(employee);
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// -------------------------- Employee --------------------------

//Get the doctor for reception 2
export const getEmployeeDetail = async (req, res) => {
    const { role } = req.params;
    try {
        const newM = await memberModel.aggregate([
            { $match: { role: role } },
            {
                $project: {
                    dname: { $concat: ["$fname", " ", "$lname"] },
                    dep: 1,
                    eid: "$mid",
                    timings: 1,
                    qs: "$questions",
                    pph: 1
                }
            }
        ]);
        
        res.status(200).json(newM);
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

//+++++++++++++++=============
export const getDoctortimings = async (req, res) => {
    const { date_no, did } = req.params;
    try {
        const employee = await getDocTimings(did,date_no);
        res.status(200).send(employee);
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