import { createSlice } from "@reduxjs/toolkit";

const EmailInterfaceSlice = createSlice({
    name: "emailInterface",
    initialState: {
        emailFieldValue: "",
        subjectFieldValue: "",
        messageFieldValue: "",
        isLoading: false,
        errorMessage: null,
    },
    reducers: {
        setEmailFieldValue(state, action) {
            return { ...state, emailFieldValue: action.payload };
        },
        setSubjectFieldValue(state, action) {
            return { ...state, subjectFieldValue: action.payload };
        },
        resetMessageFieldValue(state) {
            return { ...state, messageFieldValue: "" };
        },
        startSendEmail(state) {
            state.isLoading = true;
            state.errorMessage = null;
        },
        sendEmailSuccess(state, action) {
            const newState = { ...state, isLoading: false };
            Object.assign(newState, action.payload);
            return newState;
        },
    }
});
export const EmailInterfaceActions = EmailInterfaceSlice.actions;
export default EmailInterfaceSlice.reducer;