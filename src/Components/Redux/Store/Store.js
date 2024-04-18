import { configureStore } from '@reduxjs/toolkit';
import authreducer from '../Slices/AuthSlice';
import emailInterfaceReducer from  '../Slices/EmailInterfaceSlice';
import mailBoxReducer from  '../Slices/MailBoxSlice';
const store = configureStore({
  reducer: {
    auth: authreducer,
    emailInterface: emailInterfaceReducer,
    mailBox : mailBoxReducer,
  },
});

export default store;