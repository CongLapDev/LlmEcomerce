import { useState } from "react";

function Navbar({ collapsed }) {
    const [searchVal, setSearchVal] = useState("");
    const [notifOpen, setNotifOpen] = useState(false);
    const sidebarWidth = collapsed ? 68 : 240;

    const notifications = [
        { id: 1, msg: "New order #ORD-8821 placed", time: "2m ago", read: false },
        { id: 2, msg: "Low stock: LG OLED C4 65\"", time: "15m ago", read: false },
        { id: 3, msg: "Order #ORD-8817 cancelled", time: "45m ago", read: true },
    ];
    const unread = notifications.filter((n) => !n.read).length;

    return (
        <header
            className="fixed top-0 right-0 z-30 h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-4 transition-all duration-300"
            style={{ left: sidebarWidth }}
        >
            {/* Search */}
            <div className="flex-1 max-w-md relative">
                <i className="fi fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm leading-none" />
                <input
                    type="text"
                    placeholder="Search products, orders, users..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all duration-200"
                />
            </div>

            <div className="flex items-center gap-2 ml-auto">
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setNotifOpen((o) => !o)}
                        className="relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200 cursor-pointer"
                        aria-label="Notifications"
                    >
                        <i className="fi fi-rr-bell text-base leading-none" />
                        {unread > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-brand-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                {unread}
                            </span>
                        )}
                    </button>

                    {notifOpen && (
                        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-fade-in">
                            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-700 font-heading">Notifications</span>
                                <span className="text-xs text-brand-600 cursor-pointer hover:underline">Mark all read</span>
                            </div>
                            <ul>
                                {notifications.map((n) => (
                                    <li key={n.id} className={`px-4 py-3 flex items-start gap-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors duration-150 ${!n.read ? "bg-brand-50/40" : ""}`}>
                                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? "bg-brand-600" : "bg-slate-300"}`} />
                                        <div>
                                            <p className="text-xs text-slate-700 font-medium leading-snug">{n.msg}</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-slate-200" />

                {/* Profile */}
                <div className="flex items-center gap-2.5 pl-1 cursor-pointer group">
                    <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
                        <i className="fi fi-rr-user text-white text-sm leading-none" />
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-xs font-semibold text-slate-700 font-heading">Admin User</p>
                        <p className="text-[10px] text-slate-400">Administrator</p>
                    </div>
                    <i className="fi fi-rr-angle-down text-slate-400 text-xs leading-none group-hover:text-slate-600 transition-colors duration-150" />
                </div>
            </div>
        </header>
    );
}

export default Navbar;
