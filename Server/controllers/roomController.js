import roomCategoryModel from '../models/roomCategory.js';
import roomModel from '../models/rooms.js';
import roomInventoryModel from '../models/roomsInventory.js';
import generateBill from '../utils/billUtils.js';
import { getItem } from '../utils/helperUtils.js';
import {bookAppointment} from './appointmentController.js';
import mongoose from 'mongoose';

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
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { room_no, dep, type, pname } = req.body;

        // Booking the appointment inside the transaction
        const aid = await bookAppointment("ipd", req.body, session);

        // Updating room occupancy in one step (Optimized!)
        const bookedRoom = await roomModel.findOneAndUpdate(
            { room_no, dep, number_of_patients: { $lt: "$maxPatients" } }, // Ensure room is not full
            {
                $inc: { number_of_patients: 1 },
                $set: { occupied: { $cond: { if: { $eq: ["$number_of_patients", "$maxPatients"] }, then: "Yes", else: "No" } } }
            },
            { new: true, session }
        );

        if (!bookedRoom) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Room is already full." });
        }

        // Inserting room inventory for this booking (Single `save()` instead of insertMany)
        const bookedRoomInventory = new roomInventoryModel({
            type,
            dep,
            room_no,
            aid
        });

        await bookedRoomInventory.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: `Room ${room_no} Booked for ${pname}`, show: true });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
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

        await generateBill(roomInventory, "room", roomInventory.charge);

        res.status(200).json({ message: `Patient ${roomInventory.pname} discharged successfully.`, show: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// -------------------- Functions to be used in another files ---------------------

//Get room with the specific aid
export const getRoomWithAid = async (aid) => {
    try {
        const room = await roomInventoryModel.findOne({ aid});
        if (!room) return res.status(404).json({ message: "Room not found" });
        console.log(room);
        return room;
    } catch (err) {
        console.error(err);
        return false;
    }
};

//Confirm Bill for room
export const confirmBillRoom = async (req, res) => {
    try {
        const {aid} = req.body;
        const room = await getRoomWithAid(aid);
        if (!room) return res.status(404).json({ message: "Room not found" });

        // Generate bill
        const bill = await generateBill(room, "room", room.charge);
        if (!bill) return res.status(500).json({ message: "Error generating bill" });

        // Update the status of the bill to confirmed
        room.status = true;
        await room.save();

        res.status(200).json({ message: "Bill confirmed successfully", show: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};