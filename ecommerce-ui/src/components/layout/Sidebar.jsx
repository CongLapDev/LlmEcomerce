import { Link, useLocation } from "react-router-dom";
import { memo } from "react";

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
                group flex items-center gap-3 transition-all duration-200 cursor-pointer
                ${collapsed ? "justify-center px-2 py-3 rounded-xl" : "px-3 py-2 rounded-xl"}
                ${isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md font-semibold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }
            `}
        >
            <i className={`${item.icon} text-lg leading-none flex-shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
            {!collapsed && (
                <span className={`text-sm truncate ${isActive ? "text-white font-semibold" : "text-slate-300 group-hover:text-white"}`}>{item.label}</span>
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
                sticky top-0 left-0 h-screen flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col z-40
                transition-[width] duration-300 ease-in-out
                ${collapsed ? "w-[68px]" : "w-64"}
            `}
        >
            {/* Logo */}
            <div className={`flex items-center h-16 border-b border-slate-800 flex-shrink-0 ${collapsed ? "justify-center px-2" : "px-5 gap-3"}`}>
                <button
                    onClick={onToggle}
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200 cursor-pointer flex-shrink-0"
                    aria-label="Toggle sidebar"
                >
                    <i className="fi fi-rr-menu-burger text-base leading-none" />
                </button>
                {!collapsed && (
                    <div className="flex flex-col justify-center min-w-0">
                        <span className="text-white font-heading font-bold text-sm tracking-widest uppercase truncate leading-tight">
                            Electro
                        </span>
                        <span className="text-blue-500 font-heading text-[10px] tracking-widest uppercase font-bold leading-tight">
                            Admin
                        </span>
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-5 px-3">
                {/* Main */}
                {!collapsed && (
                    <p className="px-3 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        Main
                    </p>
                )}
                <div className="flex flex-col gap-1">
                    {NAV_ITEMS.slice(0, 5).map((item) => (
                        <NavItem key={item.key} item={item} collapsed={collapsed} isActive={isActive(item)} />
                    ))}
                </div>

                {/* Management */}
                {!collapsed && (
                    <p className="px-3 mt-6 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        Management
                    </p>
                )}
                {collapsed && <div className="my-4 border-t border-slate-800 mx-2" />}
                <div className="flex flex-col gap-1">
                    {NAV_ITEMS.slice(5).map((item) => (
                        <NavItem key={item.key} item={item} collapsed={collapsed} isActive={isActive(item)} />
                    ))}
                </div>
            </nav>

            {/* Bottom profile stub */}
            <div className={`flex-shrink-0 border-t border-slate-800 p-4 ${collapsed ? "flex justify-center" : ""}`}>
                {collapsed ? (
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-slate-700 transition">
                        <i className="fi fi-rr-user text-slate-300 text-sm leading-none" />
                    </div>
                ) : (
                    <div className="group flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-800 transition-colors duration-200 cursor-pointer">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center flex-shrink-0 transition">
                            <i className="fi fi-rr-user text-slate-300 group-hover:text-white text-sm" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-300 group-hover:text-white truncate">Admin User</p>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">admin@electro.com</p>
                        </div>
                        <i className="fi fi-rr-angle-right text-slate-500 text-xs font-bold leading-none flex-shrink-0 group-hover:text-white transition-colors" />
                    </div>
                )}
            </div>
        </aside>
    );
}

export default memo(Sidebar);
