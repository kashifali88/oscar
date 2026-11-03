import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }
  return (
    <div className='min-h-screen relative flex flex-col md:flex-row'>

    {/* mobile top bar */}
    <div className="flex items-center md:hidden p-4 bg-gray-900 text-white">
        <button onClick={toggleSidebar}>
            <FaBars size={24} />
        </button>
        <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
    </div>

    {/* overlay for mobile sidebar */}
    {isSidebarOpen && (
        <div
            onClick={toggleSidebar}
            className='fixed inset-0 bg-black/40 z-10 md:hidden'
        />
    )}

    {/* sidebar */}
    <div
        className={`
            bg-gray-900 w-64 min-h-screen text-white
            fixed md:static  top-0 left-0 z-20
            transform transition-transform duration-300
            md:translate-x-0
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
    >
        {/* sidebar nav content goes here */}
        <AdminSidebar toggleSidebar={toggleSidebar} />
    </div>
    {/* main content */}
    <div className='grow p-6 overflow-auto'>
        <Outlet />
    </div>

</div>
  )
}

export default AdminLayout;