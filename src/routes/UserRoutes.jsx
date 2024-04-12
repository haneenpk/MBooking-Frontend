import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Users/Home";

const Profile = lazy(() => import("../pages/Users/Profile"));
const EditProfile = lazy(() => import("../pages/Users/EditProfile"));
const Upcoming = lazy(() => import("../pages/Users/upcoming"));
const ShowTime = lazy(() => import("../pages/Users/showTime"));
const ShowSeats = lazy(() => import("../pages/Users/showSeats"));

import Login from "../pages/Users/Auth/Login";
import SignUp from "../pages/Users/Auth/SignUp";
import OTP from "../pages/Users/Auth/OTP";
import ErrorPage from "../pages/ErrorPage";


const UserRoutes = ({ isLoggedIn }) => {

    const navigateToLogin = () => <Navigate to="/login" />;
    const navigateToHome = () => <Navigate to="/" />;

    const protectedRoutes = [
        { path: "/", element: isLoggedIn ? <Home /> : navigateToLogin() },
        { path: "/home", element: isLoggedIn ? <Home /> : navigateToLogin() },
        { path: "/profile", element: isLoggedIn ? <Profile /> : navigateToLogin() },
        { path: "/edit-profile", element: isLoggedIn ? <EditProfile /> : navigateToLogin() },
        { path: "/upcoming", element: isLoggedIn ? <Upcoming /> : navigateToLogin() },
        { path: "/available", element: isLoggedIn ? <ShowTime /> : navigateToLogin() },
        { path: "/show/seats", element: isLoggedIn ? <ShowSeats /> : navigateToLogin() },
    ];

    const authRoutes = [
        { path: "/login", element: !isLoggedIn ? <Login role={"user"} /> : navigateToHome() },
        { path: "/sign-up", element: !isLoggedIn ? <SignUp /> : navigateToHome() },
        { path: "/verify-otp", element: !isLoggedIn ? <OTP /> : navigateToHome() },
    ];

    return (
        <Routes>
            {protectedRoutes.map(({ path, element }) => <Route key={path} path={path} element={element} />)}
            {authRoutes.map(({ path, element }) => <Route key={path} path={path} element={element} />)}
            {/* Error Page */}
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    );
};

export default UserRoutes;
