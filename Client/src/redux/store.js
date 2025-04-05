import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import drawerReducer from './slices/drawerSlice';
import medicineTab2Reducer from './slices/medicineTab2Slice';
import doctorPrescriptionReducer from './slices/doctorPrescriptionSlice';
import medicineReducer from './slices/medicineAutoCompleteSlice';
import patientAutoCompReducer from './slices/patientsAutoCompSlice';
import patientReducer from './slices/patientSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        drawer: drawerReducer,
        medicineTab2:medicineTab2Reducer,
        doctor:doctorPrescriptionReducer,
        medicine:medicineReducer,
        patientAutoComp:patientAutoCompReducer,
        patient: patientReducer,
    }
})
