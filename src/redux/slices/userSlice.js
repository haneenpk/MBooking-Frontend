import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        isLoggedIn: false,
        userData: null,
        userNotificationCount: 0,
        searchResults: {
            searchOn: null,
            results: null,
        },
    },
    reducers: {
        setLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
        },
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
    },
});

// export admin actions and reducer
export const {
    setLoggedIn,
    setUserData,
} = userSlice.actions;

export default userSlice.reducer;