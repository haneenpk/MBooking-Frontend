import { createSlice } from "@reduxjs/toolkit";

// Define initial theatre state
const initialTheaterState = {
  isLoggedIn: localStorage.getItem("theaterAccessToken") ? true : false,
  theaterData: null,
  searchResults: {
    searchOn: null,
    results: null,
  },
};

// Define theatre slice
const theaterSlice = createSlice({
  name: "theater",
  initialState: initialTheaterState,
  reducers: {
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setTheaterData: (state, action) => {
      state.theaterData = action.payload;
    },
    resetTheaterState: () => initialTheaterState, // Reset user state to initial state
  },
});

// Export user actions and reducer
export const { setLoggedIn, setTheaterData, resetTheaterState } = theaterSlice.actions;
export default theaterSlice.reducer;