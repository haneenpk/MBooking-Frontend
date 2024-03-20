import { combineReducers } from "@reduxjs/toolkit";
import adminReducer from "./slices/adminSlice";
import userReducer, { resetUserState } from "./slices/userSlice"; // Import resetUserState action
import commonSlice from "./slices/commonSlice";
import theaterSlice from "./slices/theaterSlice";

// Combine reducers
const rootReducer = combineReducers({
  admin: adminReducer,
  user: userReducer,
  theater: theaterSlice,
  common: commonSlice,
});

// Reset root reducer state to initial state
export const resetRootReducer = () => {
  return {
    admin: adminReducer(undefined, {}),
    user: userReducer(undefined, {}),
    common: commonSlice(undefined, {}),
  };
};

export default rootReducer;