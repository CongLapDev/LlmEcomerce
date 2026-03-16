import React, { useState } from 'react';
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function AdminLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const sidebarWidth = collapsed ? 68 : 240;

    return (
        <div className="min-h-screen bg-slate-50 font-body">
            {/* Sidebar */}
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((s) => !s)} />

            {/* Navbar */}
            <Navbar collapsed={collapsed} />

            {/* Main content */}
            <main
                className="transition-all duration-300 pt-16"
                style={{ marginLeft: sidebarWidth }}
            >
                <div className="p-6 space-y-6">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;
