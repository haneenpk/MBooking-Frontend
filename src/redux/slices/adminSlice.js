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
    },
});

// export admin actions and reducer
export const {
    setLoggedIn,
    setAdminData,
} = adminSlice.actions;

export default adminSlice.reducer;