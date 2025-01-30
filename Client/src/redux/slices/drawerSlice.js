import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: true,
};

const drawerSlice = createSlice({
    name: 'drawer',
    initialState,
    reducers: {
        toggleDrawer: (state) => {
            state.isOpen = !state.isOpen;
        }
    },
});

export const { toggleDrawer } = drawerSlice.actions;

export const selectDrawerState = (state) => state.isOpen.value

export default drawerSlice.reducer;