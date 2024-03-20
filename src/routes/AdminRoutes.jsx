import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Admin/Dashboard";
const Users = lazy(() => import("../pages/Admin/Users"));
const Theaters = lazy(() => import("../pages/Admin/Theaters"));
import Login from "../pages/Users/Auth/Login";
import ErrorPage from "../pages/ErrorPage";

const AdminRoutes = ({ isLoggedIn }) => {

    const navigateToLogin = () => <Navigate to="/admin/login" />;
    const navigateDashboard = () => <Navigate to="/admin" />;

    const routes = [
        { path: "/", element: isLoggedIn ? <Dashboard /> : navigateToLogin() },
        { path: "/users", element: isLoggedIn ? <Users /> : navigateToLogin() },
        { path: "/theaters", element: isLoggedIn ? <Theaters /> : navigateToLogin() },

        // Auth Route
        { path: "/login", element: !isLoggedIn ? <Login role={"admin"} /> : navigateDashboard() },
        // Error Page
        { path: "/*", element: <ErrorPage /> },
    ];

    return (
        <Routes>
            {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
            ))}
        </Routes>
    );
};

export default AdminRoutes;
