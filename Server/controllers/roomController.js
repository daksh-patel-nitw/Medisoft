import roomCategoryModel from '../models/roomCategory.js';
import roomModel from '../models/rooms.js';
import roomInventoryModel from '../models/roomsInventory.js';
import generateBill from '../utils/billUtils.js';
import { getItem } from '../utils/helperUtils.js';
import {bookAppointment} from './appointmentController.js';

//--------------------- Rooms ---------------------

// Add new room category to hospital
export const addNewRoomCategory = async (req, res) => {
    const body = req.body;
    try {
        const newRC = new roomCategoryModel({
            type: body.type,
            beds: body.beds,
            price: body.price,
            sofa: body.sofa,
            tv: body.tv,
            refrigator: body.refrigator,
            bathroom: body.bathroom,
            number_of_patients: body.number_of_patients,
            other: body.other
        });
        await newRC.save();
        res.status(200).json({ message: `Room Category ${body.type} added Successfully`, show: true });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

//Send all Room Categories
export const getAllRoomCategories = async (req, res) => {
    try {
        const rooms = await roomCategoryModel.find({});
        const deps = await getItem('dep');
        const roomCount = await roomInventoryModel.countDocuments();


        res.status(200).json([rooms, deps.content, roomCount]);
    } catch (err) {
        console.log(err);
        return (err);
    }
}

// --------------------- Room Inventory ---------------------

//Make new Room
export const addNewRoom = async (req, res) => {
    const body = req.body;    
    try {
        const newR = new roomModel({
            type: body.type,
            dep: body.dep,
            floor: body.floor,
            room_no: body.room_no,
            price: body.price,
            maxPatients: body.maxPatients,
        });
        await newR.save();
        res.status(200).json({ message: `Room ${body.room_no} added Successfully`, show: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

//Get All Rooms
export const getAllRooms = async (req, res) => {
    try {
        const result = await roomInventoryModel.find({status:"P"});

        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

//get all rooms by department
export const getAllRoomsByDep = async (req, res) => {
    try {

        //Finding all the non empty rooms in the department.
        const result = await roomModel.find({ dep: req.params.dep, occupied: "No" });
        
        //Find the unique types of rooms in the department
        const uniqueTypes = await roomCategoryModel.distinct("type");

        res.status(200).json([result,uniqueTypes]);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

//Book Room 
export const bookRoom = async (req, res) => {
    const body = req.body;
    try {
        // making the appointment
        const aid=await bookAppointment('ipd',body);

        // Fetching only required fields
        const room = await roomModel.findOne(
            { room_no: body.room_no, dep: body.dep },
            { maxPatients: 1, number_of_patients: 1 }
        );
        
        if (room && room.number_of_patients < room.maxPatients) {
            const bookedRoom = await roomModel.findOneAndUpdate(
                { room_no: body.room_no, dep: body.dep },
                {
                    $inc: { number_of_patients: 1 }, // Increment patient count
                    $set: { 
                        occupied: room.number_of_patients + 1 === room.maxPatients ? "Yes" : "No",
                    }
                },
                { new: true }
            );
            
            // console.log("Room updated:", bookedRoom);
            // console.log("Appointment ID:", aid);

            const bookedRoomInventory = new roomInventoryModel({
                type: body.type,
                dep: body.dep,
                room_no: body.room_no,
                dname: body.dname,
                did: body.did,
                pid: body.pid,
                aid: aid,
                pname: body.pname,
                mobile: body.mobile,
                status: "P"
            });
            bookedRoomInventory.save();
            
            // console.log("Room booked:", bookedRoom);
        } else {
            res.status(400).json({ message: "Room is already full." });
        }
        
        res.status(200).json({message: `Room ${body.room_no} Booked for ${body.pname} `, show: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

//Free or discharge room
export const dischargeRoom = async (req, res) => {
    try {
        const { id} = req.body;

        // Fetch the room inventory record
        const roomInventory = await roomInventoryModel.findById(id);
        if (!roomInventory) return res.status(404).json({ message: "Room Inventory not found" });

        // Fetch the associated room details
        const room = await roomModel.findOneAndUpdate(
            { room_no: roomInventory.room_no, dep: roomInventory.dep },
            { 
                $inc: { number_of_patients: -1 }, 
                $set: { occupied: "No" } 
            },
            { new: true }
        );
        if (!room) return res.status(404).json({ message: "Room not found" });

        // Update roomInventory details
        roomInventory.status = "Discharged";
        roomInventory.charge = room.price * Math.ceil((Date.now() - new Date(roomInventory.createdAt)) / (1000 * 60 * 60 * 24));

        await roomInventory.save(); // Save changes to DB

        res.status(200).json({ message: `Patient ${roomInventory.pname} discharged successfully.`, show: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

