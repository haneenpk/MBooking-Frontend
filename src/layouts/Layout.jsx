import React, { useEffect, useLayoutEffect } from 'react';
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MainRouter from "../routes/MainRouter";
import AdminHeader from "../components/Admin/AdminHeader";
import Header from "../components/Users/Header";
import Footer from "../components/Users/Footer";
import { setLoggedIn, setAdminData } from "../redux/slices/adminSlice";
import { setLoggedIn as setUserLoggedIn, setUserData } from "../redux/slices/userSlice";
import { checkToDisplayHeaderFooter } from "../utils/routeUtil";
import { userRoutesToCheck, adminRoutesToCheck } from "../config/routesConfig";

const Layout = () => {

  const dispatch = useDispatch();
  const isUserLoggedIn = useSelector(state => state.user.isLoggedIn);

  const location = useLocation();
  let userRole;
  if(location.pathname.startsWith("/admin")){
    userRole = "admin"
  } else if (location.pathname.startsWith("/theatre")){
    userRole = "theatre"
  }else{
    userRole = "user"
  }
  // const userRole = location.pathname.startsWith("/admin") ? "admin" : "user";
  const shouldDisplayHeaderFooter = checkToDisplayHeaderFooter(
    userRole === "admin" ? adminRoutesToCheck : userRoutesToCheck,
    location
  );

  useEffect(() => {
    if(localStorage.getItem(`${userRole}AccessToken`)){
      if(userRole === "admin"){
        dispatch(setLoggedIn(true));
        dispatch(setAdminData(localStorage.getItem("data")));
      }else{
        dispatch(setUserLoggedIn(true));
        console.log("changed:",isUserLoggedIn,localStorage.getItem(`${userRole}AccessToken`));
        dispatch(setUserData(localStorage.getItem("data")));
      }
    }
  }, [isUserLoggedIn])
  

  return (
    <div className="flex flex-col min-h-screen">
      {shouldDisplayHeaderFooter && (userRole === "admin" ? <AdminHeader /> : <Header />)}
      <main className="flex-1" style={{ paddingTop: shouldDisplayHeaderFooter ? 0 : 0 }}>
        <MainRouter />
      </main>
      {shouldDisplayHeaderFooter && userRole === "user" && !location.pathname.includes("chat") && <Footer />}
    </div>
  );
};

export default Layout;