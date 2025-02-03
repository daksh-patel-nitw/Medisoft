import roomModel from '../models/rooms.js';
import roomInventoryModel from '../models/roomInventory.js';
import generateBill from '../utils/billUtils.js';

//--------------------- Rooms ---------------------

// Add new room category to hospital
export const addNewRoomCategory = async (req, res) => {
    const body = req.body;
    try {
        const newRC = new roomModel({
            type: body.type,
            beds: body.beds,
            price: body.price,
            sofa: body.sofa,
            tv: body.tv,
            refrigator: body.refrigator,
            bathroom: body.bathroom,
            other: body.other
        });
        await newRC.save();
        res.status(200).json(newRC);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

//Send all Room Categories
export const getAllRoomCategories = async (req, res) => {
    try {
        const rc = await roomModel.find().lean();
        res.status(200).json(rc);

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
        const newR = new roomInventoryModel({
            type: body.type,
            dep: body.dep,
            floor: body.floor,
            room_no: body.room_no,
            price: body.price
        });
        await newR.save();
        res.status(200).json(newR);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

//Get All Rooms
export const getAllRooms = async (req, res) => {
    try {
        const result = await roomInventoryModel.aggregate([
            {
                $facet: {
                    occupied: [{ $match: { occupied: "Yes" } }],
                    unoccupied: [{ $match: { occupied: "No" } }]
                }
            }
        ]);

        res.status(200).json(result[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

//number of rooms
export const getRoomCount = async (req, res) => {
    try {
        const count = await roomInventoryModel.countDocuments();
        console.log(count);
        res.status(200).json(count);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

//Book Room 
export const bookRoom = async (req, res) => {
    const body = req.body;
    try {
        const bookedRoom = await roomInventoryModel.findOneAndUpdate(
            { room_no: body.room_no, dep: body.dep },
            {
                occupied: "Yes",
                did: body.did,
                aid: body.aid,
                dname: body.dname,
                pid: body.pid,
                pname: body.pname,
                mobile: body.mobile
            },
            { new: true }
        );

        await generateBill(body.pid, bookedRoom.price, body.aid, "Room Booking", "room", body.did);

        res.status(200).json(updatedRoom);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

//Free or discharge room
export const dischargeRoom = async (req, res) => {
    try {
        const { room, dep } = req.params;
        const updatedRoom = await roomInventoryModel.findOneAndUpdate(
            { room_no: room, dep: dep },
            { occupied: "No", did: "", aid: "", dname: "", pid: "", pname: "", mobile: "" },
            { new: true });
        res.status(200).json(updatedRoom);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};
