import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: null,
  uname: null,
  type: null,
  mid: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setCredentials: (state, action) => {
      state.uname = action.payload.uname;
      state.type = action.payload.type;
      state.mid = action.payload.mid;
    },
    logout: (state) => {
      state.accessToken = null;
      state.uname = null;
      state.type = null;
      state.mid = null;
    },
  },
});

export const getAuth = (state) => ({
  accessToken: state.auth.accessToken,
  uname: state.auth.uname,
  type: state.auth.type,
  mid: state.auth.mid,
});

export const { setAccessToken, setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;