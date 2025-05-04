import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    settings: null,
    loading: false,
    error: null
};

export const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setSettings: (state, action) => {
            state.settings = action.payload;
            state.loading = false;
            state.error = null;
        },
        setSettingsLoading: (state) => {
            state.loading = true;
            state.error = null;
        },
        setSettingsError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const { setSettings, setSettingsLoading, setSettingsError } = settingsSlice.actions;

export default settingsSlice.reducer; 