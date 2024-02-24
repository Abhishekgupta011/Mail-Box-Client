import { configureStore } from '@reduxjs/toolkit';
import authreducer from '../Slices/AuthSlice';

const store = configureStore({
  reducer: {
    auth: authreducer,
  },
});

export default store;