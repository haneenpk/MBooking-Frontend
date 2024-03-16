import React, { useEffect, useLayoutEffect } from 'react';
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MainRouter from "../routes/MainRouter";
import AdminHeader from "../components/Admin/AdminHeader";
import TheatreHeader from "../components/Theatre/TheatreHeader";
import Header from "../components/Users/Header";
import Footer from "../components/Users/Footer";
import { setLoggedIn, setAdminData } from "../redux/slices/adminSlice";
import { setLoggedIn as setUserLoggedIn, setUserData } from "../redux/slices/userSlice";
import { setLoggedIn as setTheatreLoggedIn, setTheatreData } from "../redux/slices/theatreSlice";
import { checkToDisplayHeaderFooter } from "../utils/routeUtil";
import { userRoutesToCheck, adminRoutesToCheck, theatreRoutesToCheck } from "../config/routesConfig";

const Layout = () => {

  const dispatch = useDispatch();
  const isUserLoggedIn = useSelector(state => state.user.isLoggedIn);
  const isTheatreLoggedIn = useSelector(state => state.theatre.isLoggedIn);
  const isAdminLoggedIn = useSelector(state => state.admin.isLoggedIn);

  const location = useLocation();
  let userRole;
  if (location.pathname.startsWith("/admin")) {
    userRole = "admin"
  } else if (location.pathname.startsWith("/theatre")) {
    userRole = "theatre"
  } else {
    userRole = "user"
  }
  // const userRole = location.pathname.startsWith("/admin") ? "admin" : "user";
  const shouldDisplayHeaderFooter = checkToDisplayHeaderFooter(
    userRole === "admin" ? adminRoutesToCheck : userRole === "user" ? userRoutesToCheck : theatreRoutesToCheck,
    location
  );

  useEffect(() => {
    if (localStorage.getItem(`${userRole}AccessToken`)) {
      if (userRole === "admin") {
        dispatch(setLoggedIn(true));
        console.log("changed:", isAdminLoggedIn, localStorage.getItem(`${userRole}AccessToken`));
        dispatch(setAdminData(localStorage.getItem("adminData")));
      } else if (userRole === "user") {
        dispatch(setUserLoggedIn(true));
        console.log("changed:", isUserLoggedIn, localStorage.getItem(`${userRole}AccessToken`));
        dispatch(setUserData(localStorage.getItem("userData")));
      } else {
        dispatch(setTheatreLoggedIn(true));
        console.log("changed:", isTheatreLoggedIn, localStorage.getItem(`${userRole}AccessToken`));
        dispatch(setTheatreData(localStorage.getItem("theatreData")));
      }
    }
  }, [isUserLoggedIn, isAdminLoggedIn, isTheatreLoggedIn])


  return (
    <div className="flex flex-col min-h-screen">
      {shouldDisplayHeaderFooter && (
        userRole === "admin" ? <AdminHeader /> :
          userRole === "user" ? <Header /> :
            <TheatreHeader />
      )}
      <main className="flex-1" style={{ paddingTop: shouldDisplayHeaderFooter ? 0 : 0 }}>
        <MainRouter />
      </main>
      {shouldDisplayHeaderFooter && (userRole === "user" || userRole === "theatre") && !location.pathname.includes("chat") && <Footer />}
    </div>
  );
};

export default Layout;