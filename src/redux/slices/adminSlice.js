import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        isLoggedIn: localStorage.getItem("adminAccessToken") ? true : false,
        adminData: null,
        searchResults: {
            searchOn: null,
            results: null,
        }
    },
    reducers: {
        setLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
        },
        setAdminData: (state, action) => {
            state.adminData = action.payload;
        },
        resetAdminState: (state) => {
            state.isLoggedIn = false
        }, // Reset user state to initial state
    },
});

// export admin actions and reducer
export const {
    setLoggedIn,
    setAdminData,
    resetAdminState,
} = adminSlice.actions;

export default adminSlice.reducer;