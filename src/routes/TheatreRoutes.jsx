import { lazy, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Users/Home";
// const Jobs = lazy(() => import("../pages/Users/Job/Jobs"));
// import PostJob from "../pages/Users/Job/PostJob";
// const ListedJobs = lazy(() => import("../pages/Users/Job/ListedJobs"));
// const ViewApplicants = lazy(() => import("../pages/Users/Job/ViewApplicants"));
// const EditListedJob = lazy(() => import("../pages/Users/Job/EditListedJob"));
// const WorksHistory = lazy(() => import("../pages/Users/Job/WorksHistory"));
// const Laborers = lazy(() => import("../pages/Users/Laborer/Laborers"));
// import Form from "../pages/Users/Laborer/BecomeLaborerForm/Form";
// const Account = lazy(() => import("../pages/Users/Account"));
const Profile = lazy(() => import("../pages/Users/Profile"));
const EditProfile = lazy(() => import("../pages/Users/EditProfile"));
// const Subscription = lazy(() => import("../pages/Users/Subscription"));
// const Success = lazy(() => import("../pages/Users/Success"));
// const Cancel = lazy(() => import("../pages/Users/Cancel"));
// const LaborerProfile = lazy(() => import("../pages/Users/Laborer/LaborerProfile"));
// const JobDetails = lazy(() => import("../pages/Users/Job/JobDetails"));
// const LaborerDetails = lazy(() => import("../pages/Users/Laborer/LaborerDetails"));
// const Chat = lazy(() => import("../pages/Users/Chat"));
import Login from "../pages/Users/Auth/Login";
import SignUp from "../pages/Users/Auth/SignUp";
// import Email from "../pages/Users/Auth/Email";
import OTP from "../pages/Users/Auth/OTP";
// import ResetPassword from "../pages/Users/Auth/ResetPassword";
// const Notifications = lazy(() => import("../pages/Notifications"));
import ErrorPage from "../pages/ErrorPage";
import Register from "../pages/Theatre/Register";


const UserRoutes = ({ isLoggedIn }) => {

    const navigateToLogin = () => <Navigate to="/theatre/login" />;
    const navigateToHome = () => <Navigate to="/theatre" />;

    // const routes = [
    //     { path: "/", element: <Home /> },
    //     { path: "/home", element: <Home /> },
    // ];

    const protectedRoutes = [
        { path: "/", element: isLoggedIn ? <Home /> : navigateToLogin() },
        { path: "/home", element: isLoggedIn ? <Home /> : navigateToLogin() },
        // { path: "/account", element: isLoggedIn ? <Account /> : navigateToLogin() },
        { path: "/profile", element: isLoggedIn ? <Profile /> : navigateToLogin() },
        { path: "/edit-profile", element: isLoggedIn ? <EditProfile /> : navigateToLogin() },
        // { path: "/manage-subscription", element: isLoggedIn ? <Subscription /> : navigateToLogin() },
        // { path: "/success", element: isLoggedIn ? <Success /> : navigateToLogin() },
        // { path: "/cancel", element: isLoggedIn ? <Cancel /> : navigateToLogin() },
        // { path: "/notifications", element: isLoggedIn ? <Notifications /> : navigateToLogin() },
        // { path: "/jobs/post-job", element: isLoggedIn ? <PostJob /> : navigateToLogin() },
        // { path: "/jobs/listed-jobs", element: isLoggedIn ? <ListedJobs /> : navigateToLogin() },
        // { path: "/jobs/listed-jobs/:id", element: isLoggedIn ? <EditListedJob /> : navigateToLogin() },
        // { path: "/jobs/view-applicants", element: isLoggedIn ? <ViewApplicants /> : navigateToLogin() },
        // { path: "/jobs/works-history", element: isLoggedIn ? <WorksHistory /> : navigateToLogin() },
        // { path: "/chat/:id/:username", element: isLoggedIn ? <Chat /> : navigateToLogin() },
        // { path: "/laborer-profile", element: isLoggedIn ? <LaborerProfile /> : navigateToLogin() },
        // { path: "/become-laborer-form", element: isLoggedIn ? <Form /> : navigateToLogin() },
    ];

    const authRoutes = [
        { path: "/login", element: !isLoggedIn ? <Login role={"theatre"} /> : navigateToHome() },
        { path: "/register", element: !isLoggedIn ? <Register /> : navigateToHome() },
        { path: "/verify-otp", element: !isLoggedIn ? <OTP /> : navigateToHome() },
        // { path: "/verify-email", element: !isLoggedIn ? <Email /> : navigateToHome() },
        // { path: "/verify-otp", element: !isLoggedIn ? <OTP /> : navigateToHome() },
        // { path: "/reset-password", element: !isLoggedIn ? <ResetPassword /> : navigateToHome() },
    ];

    return (
        <Routes>
            {/* {routes.map(({ path, element }) => <Route key={path} path={path} element={element} />)} */}
            {protectedRoutes.map(({ path, element }) => <Route key={path} path={path} element={element} />)}
            {authRoutes.map(({ path, element }) => <Route key={path} path={path} element={element} />)}
            {/* Error Page */}
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    );
};

export default UserRoutes;
