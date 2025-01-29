import express from 'express';
import * as controller from '../controllers/medicineController';


const router = express.Router();

// Create new category
router.post('/medicines/categories', controller.createMedicineCategory);  

// Get all categories
router.get('/medicines/categories', controller.getAllMedicineCategories);


// Create new medicine inventory item
router.post('/medicines', controller.createMedicineInventory);  
router.get('/medicines', controller.getAllMedicines);  // Get all medicines

// Route for fetching medicines by category (if implemented)
router.get('/medicines/category/:categoryId', controller.getMedicinesByCategory);

// Route to add a new medicine prescription
router.post('/medicine/prescription', controller.addMedicinePrescription);

// Route to get all medicines grouped by their status (Fresh, Discontinued)
router.get('/medicine/status', controller.getMedicinesByStatus);

// Route to complete a medicine prescription process (Update status, adjust inventory, and generate a bill)
router.post('/medicine/complete', controller.completeMedicinePrescription);

export default router;
