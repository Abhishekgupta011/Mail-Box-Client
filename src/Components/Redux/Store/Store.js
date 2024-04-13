import { configureStore } from '@reduxjs/toolkit';
import authreducer from '../Slices/AuthSlice';
import emailInterfacereducer from  '../Slices/EmailInterfaceSlice';
const store = configureStore({
  reducer: {
    auth: authreducer,
    emailInterface: emailInterfacereducer,
  },
});

export default store;