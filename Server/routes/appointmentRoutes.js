import { confirmAppointment, deleteAppointment, diagnoseOpd, getAllPatientApps, getCounter2app, getDoctorApps, getOPDappointment, getPatientApp, makeAppointment,confirmTheBill, getAllBill, queuescreen, seeappointment, updateIPDpat,getIPDPatients,getIPDAppointment } from '../controllers/appointmentController.js';

import express from 'express';
const router = express.Router();


//-------------------------Bill Routes -----------------------------

//Get all the bills for the specific appointment
router.post('/bill',getAllBill);

// confirm the bill for the specific appointment
router.put('/confirmBill',confirmTheBill);

//--------------------Routes for Doctor -------------------

//doctor only one OPD appointment patient wise
router.get('/dscreen/:did',getOPDappointment)

//Get all the patients appointments in the specific doctor
router.get('/doctor/:pid/:did',getAllPatientApps);

//Doctor Diagnosis OPD
router.put('/diagnose',diagnoseOpd);

//Update appointment details iPD
router.put('/diagnoseIPD',updateIPDpat);

//Get the appointment of the specific patient for IPD for specific doctor
router.get('/ipd/:did/:pid',getIPDAppointment);

//Get all the patients IPD for specific doctor
router.get('/ipd/:did',getIPDPatients);

//-------------------------Queue Screen -----------------------------

// Queue Screen 
router.get('/queuescreen/:dep',queuescreen);

//-------------------------Create OPD or IPD appointment -----------------------------
router.post('/',makeAppointment);

//-------------------------Counter-2 Routes -----------------------------

//Send Data Appointments with department Counter-2
router.get('/getapp/:dep',getCounter2app);

//Confirm Appointment on Counter-2
router.put('/',confirmAppointment);

//Cancel Appointment on Counter-2
router.delete('/:id',deleteAppointment);



//------------------------- Unused


//--------------------Routes for Patient -------------------

//Get All Appointments of a patient for patient screen
router.get('/patient/:pid',getPatientApp);

//--------------------Routes for Reception -------------------

//Get All Appointments of a doctor
router.get('/doctor/:did',getDoctorApps);

//--------------------Routes for Doctor-------------------





// http://localhost:5000/api/seeappointment/E000000C
router.get('/reception/:id',seeappointment);







export default router;