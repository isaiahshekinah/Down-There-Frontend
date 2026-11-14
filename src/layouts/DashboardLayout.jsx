
import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Siderbar";
import Header from "../components/Header";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#FFF9F8] flex">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      <div className="flex-1 min-w-0 md:pl-64 flex flex-col min-h-screen">
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
