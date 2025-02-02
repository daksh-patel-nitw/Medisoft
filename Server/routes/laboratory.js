import express from 'express';
import * as controller from '../controllers/laboratory.js';

const router = express.Router();

//--------------- LABORATORY Inventory --------------------

//Add new test for Hospital
router.post('/', controller.addNewTest);

//update test detail
router.put('/:value', controller.updateTest);

//Send All Tests to laboratory
router.get('/', controller.getAllTests);

//delete test
router.delete('/:id', controller.deleteTest);

//---------------- Prescription of Tests----------------

//add Test from doctor
router.post('/prescribe', controller.prescribeTest)

//Send All laboratory tests status 
router.get('/prescribe', controller.getAllPrescribedTests);

//Take patient details, here type is out/in
router.put('/details/:id/:type', controller.updatePatientDetails);

// Finish the test 
router.get('/results/:id/:value', controller.updateTestResults);

export default router;