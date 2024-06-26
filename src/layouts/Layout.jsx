import React, { useEffect } from 'react';
import Axios from "../api/shared/instance";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MainRouter from "../routes/MainRouter";
import AdminHeader from "../components/Admin/AdminHeader";
import TheaterHeader from "../components/Theater/TheaterHeader";
import Header from "../components/Users/Header";
import Footer from "../components/Users/Footer";
import { setLoggedIn, setAdminData } from "../redux/slices/adminSlice";
import { setLoggedIn as setUserLoggedIn, setUserData } from "../redux/slices/userSlice";
import { setLoggedIn as setTheaterLoggedIn, setTheaterData } from "../redux/slices/theaterSlice";
import { checkToDisplayHeaderFooter } from "../utils/routeUtil";
import { userRoutesToCheck, adminRoutesToCheck, theaterRoutesToCheck } from "../config/routesConfig";

const Layout = () => {

  const dispatch = useDispatch();
  const isUserLoggedIn = useSelector(state => state.user.isLoggedIn);
  const isTheaterLoggedIn = useSelector(state => state.theater.isLoggedIn);
  const isAdminLoggedIn = useSelector(state => state.admin.isLoggedIn);

  const location = useLocation();
  let userRole;
  if (location.pathname.startsWith("/admin")) {
    userRole = "admin"
  } else if (location.pathname.startsWith("/theater")) {
    userRole = "theater"
  } else {
    userRole = "user"
  }
  // const userRole = location.pathname.startsWith("/admin") ? "admin" : "user";
  const shouldDisplayHeaderFooter = checkToDisplayHeaderFooter(
    userRole === "admin" ? adminRoutesToCheck : userRole === "user" ? userRoutesToCheck : theaterRoutesToCheck,
    location
  );

  useEffect(() => {
    const fetchData = async () => {
      console.log(userRole, localStorage.getItem(`${userRole}AccessToken`));
      if (localStorage.getItem(`${userRole}AccessToken`)) {
        if (userRole === "admin") {
          dispatch(setLoggedIn(true));
          console.log("changedA:", isAdminLoggedIn);
          dispatch(setAdminData(localStorage.getItem("adminData")));
        } else if (userRole === "user") {
          dispatch(setUserLoggedIn(true));
          console.log("changedU:", isUserLoggedIn);
          try {
            const response = await Axios.get(`/api/user/get/${localStorage.getItem("userData")}`);
            dispatch(setUserData(response.data.data));
          } catch (error) {
            // Handle error
          }
        } else {
          dispatch(setTheaterLoggedIn(true));
          console.log("changedT:", isTheaterLoggedIn);
          dispatch(setTheaterData(localStorage.getItem("theaterData")));
        }
      }
    };

    fetchData();
  }, [isUserLoggedIn, isAdminLoggedIn, isTheaterLoggedIn]);

  return (
    <div className="flex flex-col min-h-screen">
      {shouldDisplayHeaderFooter && (
        userRole === "admin" ? <AdminHeader /> :
          userRole === "user" ? <Header /> :
            <TheaterHeader />
      )}
      <main className="flex-1" style={{ paddingTop: shouldDisplayHeaderFooter ? 0 : 0 }}>
        <MainRouter />
      </main>
      {shouldDisplayHeaderFooter && (userRole === "user" || userRole === "theater") && !location.pathname.includes("chat") && <Footer />}
    </div>
  );
};

export default Layout;