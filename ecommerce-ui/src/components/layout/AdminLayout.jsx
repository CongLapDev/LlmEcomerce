import React, { useState } from 'react';
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function AdminLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50 font-body">
            {/* Sidebar */}
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((s) => !s)} />

            {/* Main wrapper */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                {/* Navbar */}
                <Navbar collapsed={collapsed} />

                {/* Main content */}
                <main className="flex-1 p-6 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
