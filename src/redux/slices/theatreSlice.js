import { createSlice } from "@reduxjs/toolkit";

// Define initial theatre state
const initialTheatreState = {
  isLoggedIn: localStorage.getItem("theatreAccessToken") ? true : false,
  theatreData: null,
  searchResults: {
    searchOn: null,
    results: null,
  },
};

// Define theatre slice
const theatreSlice = createSlice({
  name: "theatre",
  initialState: initialTheatreState,
  reducers: {
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setTheatreData: (state, action) => {
      state.theatreData = action.payload;
    },
    resetTheatreState: () => initialTheatreState, // Reset user state to initial state
  },
});

// Export user actions and reducer
export const { setLoggedIn, setTheatreData, resetTheatreState } = theatreSlice.actions;
export default theatreSlice.reducer;