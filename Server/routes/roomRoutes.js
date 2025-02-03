import express from 'express';
import * as controller from '../controllers/roomController.js';

const router = express.Router();

//--------------------- Rooms ---------------------

// Add new room category to hospital
router.post("/category",controller.addNewRoomCategory);

// Get all Room Categories
router.get('/category',controller.getAllRoomCategories);

// --------------------- Room Inventory ---------------------

// Make new Room
router.post('/',controller.addNewRoom);

//Get All Rooms
router.get('/',controller.getAllRooms);

//Get Room Count
router.get('/count',controller.getRoomCount);

//Book Room 
router.post('/book',controller.bookRoom);

//Free or discharge room
router.get('/discharge/:room/:dep',controller.dischargeRoom);

export default router;