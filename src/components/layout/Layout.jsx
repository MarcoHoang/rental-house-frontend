// src/components/layout/Layout.jsx

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
// Không cần import CSS Modules nữa

const Layout = ({ children }) => {
  return (
    // Chỉ là một thẻ div bọc ngoài, không có style gì đặc biệt
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
