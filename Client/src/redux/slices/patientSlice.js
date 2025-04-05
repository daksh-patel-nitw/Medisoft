import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

const authSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setPatient: (state, action) => action.payload,
    clearPatient: () => null,                     
  },
});

export const getPatient = (state) => state.patient;

export const { setPatient, clearPatient } = authSlice.actions;

export default authSlice.reducer;
