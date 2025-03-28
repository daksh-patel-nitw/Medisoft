import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tests: [],
}

const doctorSlice=createSlice({
    name:'doctor',
    initialState,
    reducers:{
        setTests:(state,action)=>{
            state.tests=action.payload;
        }
    }
})

export const {setTests}=doctorSlice.actions;

export const getTests=(state)=>state.doctor.tests;

export default doctorSlice.reducer;