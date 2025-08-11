import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import styled from "styled-components";

const LayoutContainer = styled.div`
  padding: 20px;
`;

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
