import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Theater/Dashboard";
const ListScreen = lazy(() => import("../pages/Theater/ListScreen"));
const AddScreen = lazy(() => import("../pages/Theater/AddScreen"));
const ViewScreen = lazy(() => import("../pages/Theater/ViewScreen"));
const Profile = lazy(() => import("../pages/Theater/Profile"));
const EditProfile = lazy(() => import("../pages/Theater/EditProfile"));
const Show = lazy(() => import("../pages/Theater/Show"));
const AddShow = lazy(() => import("../pages/Theater/AddShow"));
const EditShow = lazy(() => import("../pages/Theater/EditShow"));

import Login from "../pages/Users/Auth/Login";
import OTP from "../pages/Theater/Auth/OTP";
import ErrorPage from "../pages/ErrorPage";
import Register from "../pages/Theater/Auth/Register";


const TheaterRoutes = ({ isLoggedIn }) => {

    const navigateToLogin = () => <Navigate to="/theater/login" />;
    const navigateDashboard = () => <Navigate to="/theater/" />;

    const protectedRoutes = [
        { path: "/", element: isLoggedIn ? <Dashboard /> : navigateToLogin() },
        { path: "/dashboard", element: isLoggedIn ? <Dashboard /> : navigateToLogin() },
        { path: "/screens", element: isLoggedIn ? <ListScreen /> : navigateToLogin() },
        { path: "/screens/add", element: isLoggedIn ? <AddScreen /> : navigateToLogin() },
        { path: "/screen/edit", element: isLoggedIn ? <ViewScreen /> : navigateToLogin() },
        { path: "/profile", element: isLoggedIn ? <Profile /> : navigateToLogin() },
        { path: "/edit-profile", element: isLoggedIn ? <EditProfile /> : navigateToLogin() },
        { path: "/show/add", element: isLoggedIn ? <AddShow /> : navigateToLogin() },
        { path: "/show", element: isLoggedIn ? <Show /> : navigateToLogin() },
        { path: "/show/edit", element: isLoggedIn ? <EditShow /> : navigateToLogin() },

    ];

    const authRoutes = [
        { path: "/login", element: !isLoggedIn ? <Login role={"theater"} /> : navigateDashboard() },
        { path: "/register", element: !isLoggedIn ? <Register /> : navigateDashboard() },
        { path: "/verify-otp", element: !isLoggedIn ? <OTP /> : navigateDashboard() },
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

export default TheaterRoutes;
