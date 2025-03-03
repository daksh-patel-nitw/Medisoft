import express from 'express';
import { addDoctorTimings, getPatientNamesId,addMember, getAdminEmployee, getAllPatients, updateRole,getDoctorByDepartment, getDoctortimings, getDoctorDetails, getMemberWithId } from '../controllers/memberController.js';
const router = express.Router();

//adding new members
router.post('/',addMember);



//getting the doctor details for the reception 1 to book appointment
router.get('/doctors',getDoctorDetails);
router.get('/patient/reception',getPatientNamesId);

// Getting the doctor timings for reception 1
router.get('/doctorTiming/:date/:did',getDoctortimings);
// --------------------------------- Unused ------------------------------------------------

//getting employee with Id
router.get('/emp/:id',getMemberWithId);

//Queue Screen
router.get('/doctor/:dep',getDoctorByDepartment);

//add doctor timings
router.post('/timings',addDoctorTimings);

//update the roles of the employee for the admin panel
router.post('/role',updateRole);

//Employee data for Admin
router.get('/admin',getAdminEmployee);

//get all patients
router.get('/patient',getAllPatients);

export default router;