import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../../components/layout/AdminLayout";
import KPIStats from "../../../components/dashboard/KPIStats";
import SalesChart from "../../../components/dashboard/SalesChart";
import UserGrowthChart from "../../../components/dashboard/UserGrowthChart";
import RevenueByCategory from "../../../components/dashboard/RevenueByCategory";
import TopProducts from "../../../components/dashboard/TopProducts";
import TopCustomers from "../../../components/dashboard/TopCustomers";
import RecentOrdersTable from "../../../components/dashboard/RecentOrdersTable";
import LowStockAlert from "../../../components/dashboard/LowStockAlert";
import ActivityFeed from "../../../components/dashboard/ActivityFeed";
import {
    getDashboardStats,
    getSalesChart,
    getUserGrowth,
    getRevenueByCategory,
    getTopProducts,
    getTopCustomers,
    getRecentOrders,
    getLowStockProducts,
} from "../../../services/dashboardService";

// ── Loading skeleton card ────────────────────────────────────────────────────
function SkeletonCard({ className = "" }) {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-5 animate-pulse ${className}`}>
            <div className="h-3 w-1/3 bg-slate-200 rounded mb-3" />
            <div className="h-7 w-1/2 bg-slate-200 rounded mb-2" />
            <div className="h-2.5 w-1/4 bg-slate-100 rounded" />
        </div>
    );
}

function SkeletonChart({ className = "", height = "h-52" }) {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-5 animate-pulse ${className}`}>
            <div className="h-3 w-1/4 bg-slate-200 rounded mb-5" />
            <div className={`${height} bg-slate-100 rounded-lg`} />
        </div>
    );
}

// ── Error banner ──────────────────────────────────────────────────────────────
function ErrorBanner({ message, onRetry }) {
    return (
        <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-xl text-sm">
            <div className="flex items-center gap-2 text-red-700">
                <i className="fi fi-rr-triangle-warning text-base leading-none" />
                <span className="font-body">{message}</span>
            </div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 underline cursor-pointer font-body"
                >
                    Retry
                </button>
            )}
        </div>
    );
}

// ── Main Dashboard Page ───────────────────────────────────────────────────────
function AdminDashboardPage() {

    // ── State ──
    const [kpi, setKpi] = useState({
        totalRevenue: 0,
        revenueGrowth: 0,
        ordersToday: 0,
        ordersGrowth: 0,
        totalProducts: 0,
        productsGrowth: 0,
        totalUsers: 0,
        usersGrowth: 0,
    });
    const [sales, setSales] = useState([]);
    const [userGrowth, setUserGrowth] = useState([]);
    const [revenueByCategory, setRevenueByCategory] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [lowStock, setLowStock] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── Fetch all dashboard data in parallel ──────────────────────────────────
    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [
                kpiData,
                salesData,
                userGrowthData,
                revByCatData,
                topProductsData,
                topCustomersData,
                recentOrdersData,
                lowStockData,
            ] = await Promise.all([
                getDashboardStats(),
                getSalesChart(),
                getUserGrowth(),
                getRevenueByCategory(),
                getTopProducts({ limit: 5 }),
                getTopCustomers({ limit: 5 }),
                getRecentOrders({ limit: 10 }),
                getLowStockProducts(),
            ]);

            setKpi(kpiData);
            setSales(salesData);
            setUserGrowth(userGrowthData);
            setRevenueByCategory(revByCatData);
            setTopProducts(topProductsData);
            setTopCustomers(topCustomersData);
            setRecentOrders(recentOrdersData);
            setLowStock(lowStockData);
        } catch (err) {
            console.error("[Dashboard] Failed to load dashboard data:", err);
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to load dashboard data. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    // ── Refresh sales chart for a custom date range ───────────────────────────
    const handleSalesRangeChange = useCallback(async (from, to) => {
        try {
            const data = await getSalesChart({ from, to });
            setSales(data);
        } catch (err) {
            console.error("[Dashboard] Failed to reload sales chart:", err);
        }
    }, []);

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <AdminLayout>
            {/* Page header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold font-heading text-slate-800 tracking-tight">
                                Dashboard
                            </h1>
                            <p className="text-xs text-slate-400 font-body mt-0.5">{today}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={fetchAll}
                                disabled={loading}
                                className="flex items-center gap-2 text-xs font-medium text-slate-600 border border-slate-200 bg-white hover:border-brand-500 hover:text-brand-600 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer shadow-sm disabled:opacity-50"
                            >
                                <i className={`fi fi-rr-refresh text-xs leading-none ${loading ? "animate-spin" : ""}`} />
                                <span>Refresh</span>
                            </button>
                            <button className="flex items-center gap-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer shadow-sm shadow-brand-600/20">
                                <i className="fi fi-rr-download text-xs leading-none" />
                                <span>Export</span>
                            </button>
                        </div>
                    </div>

                    {/* Error banner */}
                    {error && <ErrorBanner message={error} onRetry={fetchAll} />}

                    {/* ── KPI Cards ── */}
                    {loading ? (
                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : (
                        <KPIStats data={kpi} />
                    )}

                    {/* ── Sales + User Growth ── */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                        <div className="xl:col-span-2">
                            {loading
                                ? <SkeletonChart height="h-52" />
                                : <SalesChart data={sales} onRangeChange={handleSalesRangeChange} />
                            }
                        </div>
                        {loading
                            ? <SkeletonChart />
                            : <UserGrowthChart data={userGrowth} />
                        }
                    </div>

                    {/* ── Top Products + Top Customers + Revenue by Category ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {loading ? (
                            <>
                                <SkeletonChart height="h-48" />
                                <SkeletonChart height="h-48" />
                                <SkeletonChart height="h-48" />
                            </>
                        ) : (
                            <>
                                <TopProducts data={topProducts} />
                                <TopCustomers data={topCustomers} />
                                <RevenueByCategory data={revenueByCategory} />
                            </>
                        )}
                    </div>

                    {/* ── Low Stock + Activity Feed ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <div className="lg:col-span-1">
                            {loading
                                ? <SkeletonChart height="h-64" />
                                : <LowStockAlert data={lowStock} />
                            }
                        </div>
                        <div className="lg:col-span-2">
                            {/* Activity feed: static or from a separate API */}
                            <ActivityFeed data={[]} />
                        </div>
                    </div>

                    {/* ── Recent Orders (full width) ── */}
                    {loading
                        ? <SkeletonChart height="h-48" className="w-full" />
                        : <RecentOrdersTable data={recentOrders} />
                    }
        </AdminLayout>
    );
}

export default AdminDashboardPage;