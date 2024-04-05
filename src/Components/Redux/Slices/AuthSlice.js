import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    isLoggedIn: false,
    isLogin: false,
  },
  reducers: {
    login(state, action) {
      state.token = action.payload;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem('idToken'); // remove token from local storage
      localStorage.removeItem('email')
    },
    setIsLogin(state , action){
      state.isLogin=action.payload;
    }
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;