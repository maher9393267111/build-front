import { createSlice } from "@reduxjs/toolkit";

// fullname
// avatar
// phone
// cv
// description

const initialState = {
    profile: undefined,
    showPopupMyProfile: false
};

export const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        resetStateProfile: () => {
            return initialState;
        },
        setProfile: (state, _action) => {
            state.profile = _action.payload;
            return state;
        },
        setShowPopupMyProfile: (state, _action) => {
            state.showPopupMyProfile = _action.payload;
            return state;
        }
    },
});

export const {
    resetStateProfile,
    setProfile,
    setShowPopupMyProfile
} = profileSlice.actions;
export default profileSlice.reducer;
