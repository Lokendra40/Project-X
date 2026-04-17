import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function DashboardLayout({ changeTheme, currentTheme }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Navbar changeTheme={changeTheme} currentTheme={currentTheme} />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
