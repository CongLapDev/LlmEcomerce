import { useState } from "react";

function Navbar({ collapsed }) {
    const [searchVal, setSearchVal] = useState("");
    const [notifOpen, setNotifOpen] = useState(false);
    const notifications = [
        { id: 1, msg: "New order #ORD-8821 placed", time: "2m ago", read: false },
        { id: 2, msg: "Low stock: LG OLED C4 65\"", time: "15m ago", read: false },
        { id: 3, msg: "Order #ORD-8817 cancelled", time: "45m ago", read: true },
    ];
    const unread = notifications.filter((n) => !n.read).length;

    return (
        <header
            className="sticky top-0 z-30 h-16 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center px-6 gap-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        >
            {/* Search */}
            <div className="flex-1 max-w-md relative group">
                <i className="fi fi-rr-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[13px] leading-none group-focus-within:text-brand-600 transition-colors" />
                <input
                    type="text"
                    placeholder="Search products, orders, users..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full text-sm bg-slate-50/50 hover:bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl pl-9 pr-12 py-2 text-slate-900 font-medium placeholder-[rgba(15_23_42_/_0.4)] focus:outline-none focus:background-white focus:ring-[3px] focus:ring-brand-500/10 focus:border-brand-500 transition-all duration-300 font-body placeholder:font-body shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center pointer-events-none opacity-70 group-focus-within:opacity-0 transition-opacity duration-200">
                    <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-sans font-semibold text-slate-500 bg-white border border-slate-200/80 rounded shadow-[0_1px_1px_rgba(0,0,0,0.04)]">
                        ⌘K
                    </kbd>
                </div>
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setNotifOpen((o) => !o)}
                        className={`relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 transition-all duration-300 cursor-pointer ${notifOpen ? "bg-slate-100/80 text-slate-900" : "hover:bg-slate-100/80"}`}
                        aria-label="Notifications"
                    >
                        <i className="fi fi-rr-bell text-base leading-none transition-transform active:scale-95" />
                        {unread > 0 && (
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-[2.5px] ring-white"></span>
                        )}
                    </button>

                    {notifOpen && (
                        <div className="absolute right-0 top-[calc(100%+8px)] w-[360px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-slate-200/80 overflow-hidden z-50 animate-fade-in origin-top-right">
                            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                                <span className="text-[15px] font-bold text-slate-900 font-heading tracking-tight">Notifications</span>
                                <span className="text-[11px] font-semibold text-brand-600 cursor-pointer hover:text-brand-800 transition-colors uppercase tracking-wider">Mark read</span>
                            </div>
                            <ul className="max-h-96 overflow-y-auto p-2 space-y-1">
                                {notifications.map((n) => (
                                    <li key={n.id} className="p-3 flex items-start gap-3.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-all duration-200 group active:scale-[0.98]">
                                        <div className="mt-1 flex-shrink-0 relative">
                                            {n.read ? (
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200/50">
                                                    <i className="fi fi-rr-check text-[10px] text-slate-400" />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center border border-brand-100">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-brand-500 shadow-[0_0_0_2px_var(--tw-shadow-color)] shadow-brand-100" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm leading-snug truncate ${!n.read ? "font-bold text-slate-900" : "font-medium text-slate-600"}`}>{n.msg}</p>
                                            <p className="text-[11px] font-medium text-slate-400 mt-1 flex items-center gap-1.5">
                                                <i className="fi fi-rr-clock text-[9px]" />
                                                {n.time}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                                <button className="w-full py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white rounded-xl transition-all duration-200 shadow-sm border border-transparent hover:border-slate-200 hover:shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer">
                                    View all notifications
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="w-px h-5 bg-slate-200 mx-1.5" />

                {/* Profile */}
                <div className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl hover:bg-slate-100/80 cursor-pointer group transition-all duration-300">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.1)] group-hover:scale-105 transition-transform duration-300">
                        <span className="text-[10px] font-bold text-white tracking-widest leading-none">A</span>
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-bold text-slate-900 font-heading leading-tight tracking-tight">Admin</p>
                    </div>
                    <i className="fi fi-rr-angle-down text-slate-400 text-[10px] leading-none ml-1 group-hover:text-slate-900 transition-colors duration-200" />
                </div>
            </div>
        </header>
    );
}

export default Navbar;
