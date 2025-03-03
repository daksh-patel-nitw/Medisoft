import { confirmAppointment, deleteAppointment, diagnoseOpd, getAllPatientApps, getCounter2app, getDoctorApps, getIpdappointment, getPatientApp, makeAppointment, queuescreen, seeappointment, updateIPDpat } from '../controllers/appointmentController.js';

import express from 'express';
const router = express.Router();

//Create opd or IPD appointment
router.post('/:type',makeAppointment);

//--------------------Routes for Patient -------------------

//Get All Appointments of a patient for patient screen
router.get('/:pid',getPatientApp);

//--------------------Routes for Reception -------------------

//Get All Appointments of a doctor
router.get('/doctor/:did',getDoctorApps);

//Confirm Appointment on Counter-2
router.put('/',confirmAppointment);

//Send Data Appointments with department
router.get('/getapp/:dep',getCounter2app);

//Cancel Appointment
router.delete('/:id',deleteAppointment);

//--------------------Routes for Doctor-------------------

//Doctor Diagnosis
router.put('/doctor/diagnose',diagnoseOpd);

//Get All Appointments history of a patient
router.get('/doctor/:pid/:did',getAllPatientApps);

//doctor IPD appointment
// localhost:5000/api/getIpdappointment/E000000G
router.get('/dscreen/:did',getIpdappointment)

//Update appointment details iPD
router.put('/ipd/update',updateIPDpat);

router.get('/queuescreen/:id',queuescreen);

// http://localhost:5000/api/seeappointment/E000000C
router.get('/reception/:id',seeappointment);

export default router;