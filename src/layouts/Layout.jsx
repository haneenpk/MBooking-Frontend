import React from 'react';
import { useLocation } from "react-router-dom";
import MainRouter from "../routes/MainRouter";
import AdminHeader from "../components/Admin/AdminHeader";
import Header from "../components/Users/Header";
import Footer from "../components/Users/Footer";
import { checkToDisplayHeaderFooter } from "../utils/routeUtil";
import { userRoutesToCheck, adminRoutesToCheck } from "../config/routesConfig";

const Layout = () => {
  const location = useLocation();
  const userRole = location.pathname.startsWith("/admin") ? "admin" : "user";
  const shouldDisplayHeaderFooter = checkToDisplayHeaderFooter(
    userRole === "admin" ? adminRoutesToCheck : userRoutesToCheck,
    location
  );

  return (
    <div className="flex flex-col min-h-screen">
      {shouldDisplayHeaderFooter && (userRole === "admin" ? <AdminHeader /> : <Header />)}
      <main className="flex-1" style={{ paddingTop: shouldDisplayHeaderFooter ? "72px" : 0 }}>
        <MainRouter />
      </main>
      {shouldDisplayHeaderFooter && userRole === "user" && !location.pathname.includes("chat") && <Footer />}
    </div>
  );
};

export default Layout;