import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    inputValues: { pname: '', pid: '', mobile: '' },
    options: [],
    activeAutoComplete: null
};

const patient = createSlice({
    name: 'patientAutoComp',
    initialState,
    reducers: {
        setPatientAutoComp: (state, action) => {
            const { i, val } = action.payload;
            state.inputValues[i] = val;
        },
        setPatientOptions: (state, action) => {
            state.options = action.payload;
        },
        clearPatient: (state) => {
            state.inputValues = { pname: '', pid: '', mobile: '' };
            state.options = [];
        },
        setActiveAutoComplete: (state, action) => {
            state.activeAutoComplete = action.payload;
        },
    }
});

export const { setPatientAutoComp, setActiveAutoComplete, setPatientOptions, clearPatient } = patient.actions;
export const getPatient = (state) => state.patientAutoComp.inputValues;
export const getPatientOptions = (state) => state.patientAutoComp.options;
export const getActiveAutoComplete = (state) => state.patientAutoComp.activeAutoComplete;
export default patient.reducer;
