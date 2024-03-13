import React, { Suspense, useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import initializeUser from "../utils/initializeUser";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import AdminRoutes from "./AdminRoutes";
import UserRoutes from "./UserRoutes";

const MainRouter = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [isInitialized, setIsInitialized] = useState(false);

  const isLoading = useSelector(state => state.common.loading);
  const isAdminLoggedIn = useSelector(state => state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector(state => state.user.isLoggedIn);

  useEffect(() => {
    const initialize = async () => {

      if (location.pathname.startsWith("/admin")) {
        !isAdminLoggedIn && await initializeUser("admin", dispatch);
      } else {
        !isUserLoggedIn && await initializeUser("user", dispatch);
      }

      setIsInitialized(true);
    };

    initialize();
  }, [location.pathname, isUserLoggedIn, isAdminLoggedIn]);

  if (isLoading || !isInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route
          path="/admin/*"
          element={<AdminRoutes isLoggedIn={isAdminLoggedIn} />}
        />
        <Route
          path="/*"
          element={<UserRoutes isLoggedIn={isUserLoggedIn} />}
        />
      </Routes>
    </Suspense>
  );
};

export default MainRouter;