import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Admin/Dashboard";
const Users = lazy(() => import("../pages/Admin/Users"));
const Theaters = lazy(() => import("../pages/Admin/Theaters"));
const TheaterScreen = lazy(() => import("../pages/Theater/ListScreen"));
const EditTheaterScreen = lazy(() => import("../pages/Theater/ViewScreen"));
const AddUpcomingMovie = lazy(() => import("../pages/Admin/AddUpcomingMovie"));
const EditUpcomingMovie = lazy(() => import("../pages/Admin/EditUpcomingMovie"));
const UpcomingMovies = lazy(() => import("../pages/Admin/UpcomingMovies"));
const Profile = lazy(() => import("../pages/Admin/Profile"));
const EditProfile = lazy(() => import("../pages/Admin/EditProfile"));
const Movies = lazy(() => import("../pages/Admin/Movies"));
const AddMovies = lazy(() => import("../pages/Admin/AddMovie"));
const EditMovies = lazy(() => import("../pages/Admin/EditMovie"));
import Login from "../pages/Users/Auth/Login";
import ErrorPage from "../pages/ErrorPage";

const AdminRoutes = ({ isLoggedIn }) => {

    const navigateToLogin = () => <Navigate to="/admin/login" />;
    const navigateDashboard = () => <Navigate to="/admin" />;

    const routes = [
        { path: "/", element: isLoggedIn ? <Dashboard /> : navigateToLogin() },
        { path: "/users", element: isLoggedIn ? <Users /> : navigateToLogin() },
        { path: "/theaters", element: isLoggedIn ? <Theaters /> : navigateToLogin() },
        { path: "/theater-screens", element: isLoggedIn ? <TheaterScreen /> : navigateToLogin() },
        { path: "/theater-screen/edit", element: isLoggedIn ? <EditTheaterScreen /> : navigateToLogin() },
        { path: "/upcoming/add", element: isLoggedIn ? <AddUpcomingMovie /> : navigateToLogin() },
        { path: "/upcoming", element: isLoggedIn ? <UpcomingMovies /> : navigateToLogin() },
        { path: "/upcoming/edit", element: isLoggedIn ? <EditUpcomingMovie /> : navigateToLogin() },
        { path: "/profile", element: isLoggedIn ? <Profile /> : navigateToLogin() },
        { path: "/edit-profile", element: isLoggedIn ? <EditProfile /> : navigateToLogin() },
        { path: "/movie", element: isLoggedIn ? <Movies /> : navigateToLogin() },
        { path: "/movie/add", element: isLoggedIn ? <AddMovies /> : navigateToLogin() },
        { path: "/movie/edit", element: isLoggedIn ? <EditMovies /> : navigateToLogin() },

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
