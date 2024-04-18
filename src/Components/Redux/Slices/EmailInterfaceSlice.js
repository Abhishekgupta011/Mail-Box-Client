import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sentEmails: [],
  inboxEmails: [],
  unreadMessages: 0,
  displaySent: false,
  selectedEmailId: null,
  selectedMailIdToDelete: null,
};

export const emailInterfaceSlice = createSlice({
  name: 'emailInterface',
  initialState,
  reducers: {
    setSentEmails: (state, action) => {
      state.sentEmails = action.payload;
    },
    setInboxEmails: (state, action) => {
      state.inboxEmails = action.payload;
    },
    setUnreadMessages: (state, action) => {
      state.unreadMessages = action.payload;
    },
    setDisplaySent: (state, action) => {
      state.displaySent = action.payload;
    },
    setSelectedEmailId: (state, action) => {
      state.selectedEmailId = action.payload;
    },
    setSelectedMailIdToDelete: (state, action) => {
      state.selectedMailIdToDelete = action.payload;
    },
    // Add more reducers as needed
  },
});

export const emailInterfaceActions = emailInterfaceSlice.actions;

export default emailInterfaceSlice.reducer;
