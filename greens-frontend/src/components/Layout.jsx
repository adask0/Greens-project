import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import CookieBanner from "./CookieBanner";

const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <Header />
      <main style={{ padding: "0" }}>{children}</main>
      <Footer />
      <CookieBanner />
    </div>
  );
};

export default Layout;
