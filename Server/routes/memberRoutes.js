import express from 'express';
import { updateDoctorDetails, getPatientNamesId,addMember, getAdminEmployee, getAllPatients, updateRole,getDoctorByDepartment, getDoctortimings, getDoctorDetails, deleteRole, getMemberWithId,getRolesDeps,updateRoleDeps } from '../controllers/memberController.js';
const router = express.Router();

//adding new members
router.post('/',addMember);

// --------------------------------- Reception 1 ----------------------------------------------

router.get('/doctors',getDoctorDetails);
router.get('/patient/reception',getPatientNamesId);

// --------------------------------- Reception 2 ----------------------------------------------

// Getting the doctor timings for reception 1
router.get('/doctorTiming/:date/:did',getDoctortimings);

//-------------------------------- Doctor Screen ----------------------------------------------
//getting Doctor details with id.
router.get('/getById/:id',getMemberWithId);

//updating the doctor details. ----Update this route
router.post('/updateDetails',updateDoctorDetails);


// --------------------------------- Admin Panel -------------------------------------------

//Employee Roles and Departments in the hospital
router.get('/rolesDeps/:option',getRolesDeps);

//updating the role OR deps of the employee for the admin panel
router.post('/roleDeps',updateRoleDeps);

//Employee data for Admin
router.get('/admin',getAdminEmployee);

//update the roles of the employee for the admin panel
router.post('/role',updateRole);
router.delete('/role/:id',deleteRole);



// --------------------------------- Unused ------------------------------------------------

//Queue Screen
router.get('/doctor/:dep',getDoctorByDepartment);





//get all patients
router.get('/patient',getAllPatients);

export default router;