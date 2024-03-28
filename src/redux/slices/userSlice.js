import { createSlice } from "@reduxjs/toolkit";

// Define initial user state
const initialUserState = {
  isLoggedIn: localStorage.getItem("userAccessToken") ? true : false,
  userData: null,
  searchResults: {
    searchOn: null,
    results: null,
  },
};

// Define user slice
const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    resetUserState: (state) =>  {
      state.isLoggedIn = false
    }, // Reset user state to initial state
  },
});

// Export user actions and reducer
export const { setLoggedIn, setUserData, resetUserState } = userSlice.actions;
export default userSlice.reducer;