import express from 'express';
import * as controller from '../controllers/medicinesController.js';

const router = express.Router();

// =========================== Inventory Routes =========================

//Add new medicine
router.post('/', controller.addNewMedicine);

//Get all medicine categories
router.get('/types', controller.getMedicineCategories);

//Updating or deleting medicine categories
router.post('/types', controller.updateMedicineCategories);

//delete medicine
router.delete('/:id', controller.deleteMedicine);

//Send all mediciene to pharmacy
router.get('/', controller.getAllMedicines);

//Filter medicine
router.get('/search', controller.filterMedicine);
//---------------------- Unused ----------------------------
//Send all medicine to doctor
router.get('/d', controller.getMedicineDoctor);



//update medicine detail
router.put('/:value', controller.updateMedicine);



//====================== Prescription Routes ============================

//Get all prescriptions
router.get('/prescription', controller.getAllPrescriptions);

//Sell Medicine to Customer
router.post('/sell', controller.sellMedicine);

export default router;