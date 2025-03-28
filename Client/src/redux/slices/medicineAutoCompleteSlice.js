import { createSlice } from "@reduxjs/toolkit";

const initialState={
    medicine:''
}

const medicineSlice=createSlice({
    name:'medicine',
    initialState,
    reducers:{
        setMedicineAutoComp:(state,action)=>{
            state.medicine=action.payload;
        },
        clearMedicine:(state)=>{
            state.medicine='';
        }
    }
})

export const {setMedicineAutoComp,clearMedicine}=medicineSlice.actions;

export const getMedicine=(state)=>state.medicine.medicine;

export default medicineSlice.reducer;