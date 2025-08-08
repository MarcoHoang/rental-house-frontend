import React from 'react';
import { Outlet } from 'react-router-dom';
import HostHeader from './HostHeader';
import Footer from './Footer';

const HostLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <HostHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default HostLayout;
