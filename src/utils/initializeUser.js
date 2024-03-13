// import { checkAuth } from "../api/shared/auth";
import { setLoading } from "../redux/slices/commonSlice";
import {
    setLoggedIn,
    setAdminData,
} from "../redux/slices/adminSlice";
import {
    setLoggedIn as setUserLoggedIn,
    setUserData,
} from "../redux/slices/userSlice";

const initializeUser = async (role, dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await checkAuth({ role });
        if (response && response.status === 200) {
            if (role === "admin") {
                dispatch(setLoggedIn(true));
                dispatch(setAdminData(response.currentUser.username));
            } else if (role === "user") {
                dispatch(setUserLoggedIn(true));
                dispatch(setUserData(response.currentUser));
            }
        } else {
            dispatch(setLoggedIn(false));
        }
    } catch (error) {
        console.error("Authentication check failed:", error);
        dispatch(setLoggedIn(false));
    } finally {
        dispatch(setLoading(false));
    }
};

export default initializeUser;