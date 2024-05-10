import React, { Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import AdminRoutes from "./AdminRoutes";
import UserRoutes from "./UserRoutes";
import TheaterRoutes from "./TheaterRoutes";

const MainRouter = () => {

  const isLoading = useSelector(state => state.common.loading);
  const isAdminLoggedIn = useSelector(state => state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector(state => state.user.isLoggedIn);
  const isTheaterLoggedIn = useSelector(state => state.theater.isLoggedIn);

  useEffect(() => {
    console.log(isAdminLoggedIn,isUserLoggedIn,isTheaterLoggedIn);
  

  }, [])
  


  if (isLoading) {
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
          path="/theater/*"
          element={<TheaterRoutes isLoggedIn={isTheaterLoggedIn} />}
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