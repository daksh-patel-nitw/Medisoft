import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  autoCompVal: '',
  dynamicShow: true,
  hasMore: false,
  page:1
};

const authSlice = createSlice({
  name: 'medicineTab2',
  initialState,
  reducers: {
    setAutoCompVal: (state, action) => {
      state.autoCompVal = action.payload.autoCompVal;
    },
    setDynamicShow: (state, action) => {
      state.dynamicShow = action.payload.dynamicShow;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload.hasMore;
    },
    setPage: (state, action) => {
      state.page = action.payload.page;
    },
  },
});

export const getAutoCompVal = (state) => (state.medicineTab2.autoCompVal);
export const getDynamicShow = (state) => (state.medicineTab2.dynamicShow);
export const getHasMore = (state) => (state.medicineTab2.hasMore);
export const getPage = (state) => (state.medicineTab2.page);

export const { setAutoCompVal,setDynamicShow,setHasMore,setPage } = authSlice.actions;

export default authSlice.reducer;