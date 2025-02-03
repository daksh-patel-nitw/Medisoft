import express from 'express';
import { addDoctorTimings, addMember, getAdminEmployee, getAllPatients, getDoctorByDepartment, getDoctortimings, getEmployeeDetail, getEmployeeWithId } from '../controllers/memberController';
const router = express.Router();

//adding new members
router.post('/',addMember);

//getting employee with Id
router.get('/:id',getEmployeeWithId);

//getting the doctor details.
router.get('/emp/:role',getEmployeeDetail);

//get doctor for queueScreen
router.get('/:did/:date_no',getDoctortimings);

//Queue Screen
router.get('/doctor/:dep',getDoctorByDepartment);

//add doctor timings
router.post('/timings',addDoctorTimings);

//Employee data for Admin
router.get('/admin',getAdminEmployee);

//get all patients
router.get('/patient',getAllPatients);

export default router;