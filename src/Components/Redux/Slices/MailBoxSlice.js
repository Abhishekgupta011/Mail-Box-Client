import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  to: '',
  cc: '',
  bcc: '',
  subject: '',
};

export const mailboxSlice = createSlice({
  name: 'mailbox',
  initialState,
  reducers: {
    setTo: (state, action) => {
      state.to = action.payload;
    },
    setCC: (state, action) => {
      state.cc = action.payload;
    },
    setBCC: (state, action) => {
      state.bcc = action.payload;
    },
    setSubject: (state, action) => {
      state.subject = action.payload;
    },
   
  },
});

export const mailBoxActions = mailboxSlice.actions;

export default mailboxSlice.reducer;
