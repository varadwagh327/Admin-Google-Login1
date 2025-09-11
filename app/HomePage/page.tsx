"use client";

import React from "react";
import TopNavbar from "@/Components/layout/TopNavbar";
import SideBar from "@/Components/layout/Sidebar";
import PortfolioPage from "@/Components/HomePageComponent/page";

const AdminDashboard: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navbar */}
      <TopNavbar/>

      {/* Main content area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <SideBar/>

        {/* Page content */}
        <main className="flex-1 p-6 lg:ml-64">
          {/* lg:ml-64 adds left margin on large screens for sidebar */}
          <PortfolioPage />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
