import express from 'express';
import * as controller from '../controllers/labController.js';

const router = express.Router();

//--------------- LABORATORY Inventory --------------------

//Add new test for Hospital
router.post('/', controller.addNewTest);

//Send All Tests to laboratory
router.get('/', controller.getAllTests);

//Send All Tests to Doctor Screen
router.get('/dScreen', controller.getAllTestsforDScreen);

//update test detail
router.put('/', controller.updateTest);

//delete test
router.delete('/:id', controller.deleteTest);

//---------------- Prescription of Tests----------------

//Send All laboratory tests of the patient
router.post('/prescription', controller.getAllPrescribedTests);


//-----------------Unused-------------------


//Take patient details, here type is out/in
router.put('/details/:id/:type', controller.updatePatientDetails);

// Finish the test 
router.get('/results/:id/:value', controller.updateTestResults);

export default router;