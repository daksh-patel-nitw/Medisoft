import express from 'express';
import * as controller from '../controllers/medicines.js';

const router = express.Router();

// =========================== Inventory Routes =========================

//Add new medicine
router.post('/', controller.addNewMedicine);

//Send all medicine to doctor
router.get('/d', controller.getMedicineDoctor);

//Send all mediciene to pharmacy
router.get('/', controller.getAllMedicines);

//update medicine detail
router.put('/:value', controller.updateMedicine);

//delete medicine
router.delete('/:id', controller.deleteMedicine);

//====================== Prescription Routes ============================

//Add new prescription
router.post('/prescription', controller.addNewPrescription);

//Get all prescriptions
router.get('/prescription', controller.getAllPrescriptions);

//Sell Medicine to Customer
router.post('/sell', controller.sellMedicine);

export default router;