import React, { Suspense, useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import initializeUser from "../utils/initializeUser";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import AdminRoutes from "./AdminRoutes";
import UserRoutes from "./UserRoutes";
import TheatreRoutes from "./TheatreRoutes";

const MainRouter = () => {

  const isLoading = useSelector(state => state.common.loading);
  const isAdminLoggedIn = useSelector(state => state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector(state => state.user.isLoggedIn);
  const isTheatreLoggedIn = useSelector(state => state.theatre.isLoggedIn);


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
          path="/theatre/*"
          element={<TheatreRoutes isLoggedIn={isTheatreLoggedIn} />}
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