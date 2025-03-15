import express from 'express';
import * as controller from '../controllers/roomController.js';

const router = express.Router();

//--------------------- Rooms ---------------------

// Add new room category to hospital
router.post("/category",controller.addNewRoomCategory);

// Get all Room Categories
router.get('/category',controller.getAllRoomCategories);

// ------------------------- Rooms --------------------------

// Make new Room
router.post('/',controller.addNewRoom);

//Get All Rooms of a department
router.get('/dep/:dep',controller.getAllRoomsByDep);

// --------------------- Room Inventory ---------------------
//Book Room 
router.post('/book',controller.bookRoom);

//Get All Rooms that are occupied
router.get('/',controller.getAllRooms);

//Free or discharge room
router.post('/discharge',controller.dischargeRoom);

// ------------------------ Unused ------------------------


export default router;