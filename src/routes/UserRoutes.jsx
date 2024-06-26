import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Users/Home";

const Profile = lazy(() => import("../pages/Users/Profile"));
const EditProfile = lazy(() => import("../pages/Users/EditProfile"));
const Upcoming = lazy(() => import("../pages/Users/upcoming"));
const ShowTime = lazy(() => import("../pages/Users/showTime"));
const ShowSeats = lazy(() => import("../pages/Users/showSeats"));
const ShowCheckout = lazy(() => import("../pages/Users/showCheckout"));
const Chat = lazy(() => import("../pages/Users/Chat"));
const BookingSuccess = lazy(() => import("../pages/Users/BookingSuccess"));
const BookingHistory = lazy(() => import("../pages/Users/BookingHistory"));
const Wallet = lazy(() => import("../pages/Users/Wallet"));

import Login from "../pages/Users/Auth/Login";
import SignUp from "../pages/Users/Auth/SignUp";
import OTP from "../pages/Users/Auth/OTP";
import ErrorPage from "../pages/ErrorPage";


const UserRoutes = ({ isLoggedIn }) => {

    const navigateToLogin = () => <Navigate to="/login" />;
    const navigateToHome = () => <Navigate to="/" />;

    const protectedRoutes = [
        { path: "/", element: isLoggedIn ? <Home decide={"home"} /> : navigateToLogin() },
        { path: "/home", element: isLoggedIn ? <Home decide={"home"} /> : navigateToLogin() },
        { path: "/show", element: isLoggedIn ? <Home decide={"show"} /> : navigateToLogin() },
        { path: "/profile", element: isLoggedIn ? <Profile /> : navigateToLogin() },
        { path: "/edit-profile", element: isLoggedIn ? <EditProfile /> : navigateToLogin() },
        { path: "/upcoming", element: isLoggedIn ? <Upcoming /> : navigateToLogin() },
        { path: "/available", element: isLoggedIn ? <ShowTime /> : navigateToLogin() },
        { path: "/show/seats", element: isLoggedIn ? <ShowSeats /> : navigateToLogin() },
        { path: "/show/checkout", element: isLoggedIn ? <ShowCheckout /> : navigateToLogin() },
        { path: "/chat", element: isLoggedIn ? <Chat /> : navigateToLogin() },
        { path: "/booking/success", element: isLoggedIn ? <BookingSuccess /> : navigateToLogin() },
        { path: "/booking/cancel", element: isLoggedIn ? <Chat /> : navigateToLogin() },
        { path: "/booking-history", element: isLoggedIn ? <BookingHistory /> : navigateToLogin() },
        { path: "/wallet", element: isLoggedIn ? <Wallet /> : navigateToLogin() },
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
