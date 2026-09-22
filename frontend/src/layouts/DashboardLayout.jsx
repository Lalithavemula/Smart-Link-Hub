import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAppStore } from '../store/useAppStore';

export default function DashboardLayout() {
  const { isSidebarOpen, toggleSidebar } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        <Navbar onMenuClick={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
          <div className="flex h-full">
            {/* The actual page content (Overview, Profile, Links, etc.) */}
            <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
