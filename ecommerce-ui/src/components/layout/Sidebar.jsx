import { Link, useLocation } from "react-router-dom";
import { memo, useMemo, useState } from "react";

const NAV_ITEMS = [
    { key: "/admin", icon: "fi fi-rr-dashboard", label: "Dashboard", exact: true },
    { key: "/admin/product-manage", icon: "fi fi-rr-box-open-full", label: "Products" },
    { key: "/admin/category", icon: "fi fi-rr-category-alt", label: "Categories" },
    { key: "/admin/order-manage", icon: "fi fi-rr-to-do", label: "Orders" },
    { key: "/admin/warehouse", icon: "fi fi-rr-warehouse-alt", label: "Warehouses" },
    { key: "/admin/user/manage", icon: "fi fi-rr-user-check", label: "Users" },
    { key: "/admin/analytics", icon: "fi fi-rr-chart-line-up", label: "Analytics" },
    { key: "/admin/settings", icon: "fi fi-rr-settings", label: "Settings" },
];

function NavItem({ item, collapsed, isActive }) {
    return (
        <Link
            to={item.key}
            title={collapsed ? item.label : undefined}
            className={`
                group flex items-center gap-3 rounded-xl transition-all duration-200 cursor-pointer
                ${collapsed ? "justify-center px-2 py-3" : "px-3 py-2.5"}
                ${isActive
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }
            `}
        >
            <i className={`${item.icon} text-[16px] leading-none flex-shrink-0`} />
            {!collapsed && (
                <span className="text-sm font-medium font-body truncate">{item.label}</span>
            )}
            {isActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0" />
            )}
        </Link>
    );
}

function Sidebar({ collapsed, onToggle }) {
    const location = useLocation();

    const isActive = (item) =>
        item.exact
            ? location.pathname === item.key
            : location.pathname.startsWith(item.key);

    return (
        <aside
            className={`
                fixed top-0 left-0 h-full bg-slate-900 flex flex-col z-40
                transition-all duration-300 ease-in-out
                ${collapsed ? "w-[68px]" : "w-60"}
            `}
        >
            {/* Logo */}
            <div className={`flex items-center h-16 border-b border-slate-800 flex-shrink-0 ${collapsed ? "justify-center px-2" : "px-5 gap-3"}`}>
                <button
                    onClick={onToggle}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200 cursor-pointer flex-shrink-0"
                    aria-label="Toggle sidebar"
                >
                    <i className="fi fi-rr-menu-burger text-base leading-none" />
                </button>
                {!collapsed && (
                    <div className="min-w-0">
                        <span className="text-white font-heading font-bold text-sm tracking-widest uppercase truncate block">
                            Electro
                        </span>
                        <span className="text-brand-400 font-heading text-[10px] tracking-widest uppercase">
                            Admin
                        </span>
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                {/* Main */}
                {!collapsed && (
                    <p className="px-3 mb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
                        Main
                    </p>
                )}
                {NAV_ITEMS.slice(0, 5).map((item) => (
                    <NavItem key={item.key} item={item} collapsed={collapsed} isActive={isActive(item)} />
                ))}

                {/* Management */}
                {!collapsed && (
                    <p className="px-3 mt-4 mb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
                        Management
                    </p>
                )}
                {collapsed && <div className="my-3 border-t border-slate-800" />}
                {NAV_ITEMS.slice(5).map((item) => (
                    <NavItem key={item.key} item={item} collapsed={collapsed} isActive={isActive(item)} />
                ))}
            </nav>

            {/* Bottom profile stub */}
            <div className={`flex-shrink-0 border-t border-slate-800 p-3 ${collapsed ? "flex justify-center" : ""}`}>
                {collapsed ? (
                    <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center cursor-pointer">
                        <i className="fi fi-rr-user text-white text-sm leading-none" />
                    </div>
                ) : (
                    <div className="flex items-center gap-3 px-1 py-1 rounded-xl hover:bg-slate-800 transition-colors duration-200 cursor-pointer">
                        <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center flex-shrink-0">
                            <i className="fi fi-rr-user text-white text-sm leading-none" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-white truncate">Admin User</p>
                            <p className="text-[10px] text-slate-500 truncate">admin@electro.com</p>
                        </div>
                        <i className="fi fi-rr-angle-right text-slate-600 text-xs leading-none flex-shrink-0" />
                    </div>
                )}
            </div>
        </aside>
    );
}

export default memo(Sidebar);
