import { useState, useEffect, useCallback, useContext } from "react";
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
import APIBase from "../../../api/ApiBase";
import { GlobalContext } from "../../../context";
import {
    getDashboardStats,
    getSalesChart,
    getUserGrowth,
    getRevenueByCategory,
    getTopProducts,
    getTopCustomers,
    getRecentOrders,
} from "../../../services/dashboardService";
import { useNavigate } from "react-router-dom";

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
    const globalContext = useContext(GlobalContext);
    const LOW_STOCK_THRESHOLD = 5;
    const CATEGORY_COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#1d4ed8"];
    const navigate = useNavigate();

    const toCategoryChartData = useCallback((raw = []) => {
        const list = Array.isArray(raw) ? raw : [];
        const total = list.reduce((sum, item) => sum + Number(item?.revenue ?? 0), 0);
        return list.map((item, index) => {
            const amount = Number(item?.revenue ?? 0);
            const value = total > 0 ? Number(((amount / total) * 100).toFixed(2)) : 0;
            return {
                name: item?.categoryName ?? "Unknown",
                amount,
                value,
                color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
            };
        });
    }, []);

    // ── State ──
    const [kpi, setKpi] = useState({
        totalRevenue: 0,
        revenueGrowthRate: 0,
        ordersToday: 0,
        ordersTodayGrowth: 0,
        totalProducts: 0,
        productsGrowth: 0,
        totalUsers: 0,
        usersGrowthRate: 0,
        topProducts: [],
        topCustomers: [],
        categoryRevenue: [],
    });
    const [sales, setSales] = useState([]);
    const [userGrowth, setUserGrowth] = useState([]);
    const [revenueByCategory, setRevenueByCategory] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [activityFeed, setActivityFeed] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [exporting, setExporting] = useState(false);

    // ── Export Dashboard Report ─────────────────────────────────────────────
    const handleExportDashboard = useCallback(async () => {
        setExporting(true);
        try {
            const response = await APIBase.get("/api/v1/admin/dashboard/export", {
                responseType: "blob",
                timeout: 60000, // 60 seconds timeout for file generation
            });

            // Create blob URL and trigger download
            const blob = response.data;
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `dashboard_report_${new Date().toISOString().slice(0, 10)}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            globalContext?.message?.success?.("Dashboard report exported successfully");
        } catch (err) {
            console.error("[Dashboard] Export failed:", err);
            globalContext?.message?.error?.(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to export dashboard report"
            );
        } finally {
            setExporting(false);
        }
    }, [globalContext]);

    // ── State ──
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
            ] = await Promise.all([
                getDashboardStats(),
                getSalesChart(),
                getUserGrowth(),
                getRevenueByCategory(),
                getTopProducts({ limit: 5 }),
                getTopCustomers({ limit: 5 }),
                getRecentOrders({ limit: 10 }),
            ]);

            setKpi(kpiData);
            setSales(salesData);
            setUserGrowth(userGrowthData);
            setRevenueByCategory(
                (Array.isArray(revByCatData) && revByCatData.length > 0)
                    ? revByCatData
                    : toCategoryChartData(kpiData?.categoryRevenue)
            );
            setTopProducts(
                (Array.isArray(topProductsData) && topProductsData.length > 0)
                    ? topProductsData
                    : (Array.isArray(kpiData?.topProducts) ? kpiData.topProducts : [])
            );
            setTopCustomers(
                (Array.isArray(topCustomersData) && topCustomersData.length > 0)
                    ? topCustomersData
                    : (Array.isArray(kpiData?.topCustomers) ? kpiData.topCustomers : [])
            );
            setRecentOrders(recentOrdersData);
            setLowStock(Array.isArray(kpiData?.lowStockAlerts) ? kpiData.lowStockAlerts : []);
            setActivityFeed(Array.isArray(kpiData?.activityFeed) ? kpiData.activityFeed : []);
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
    }, [toCategoryChartData]);

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
                            <button
                                onClick={handleExportDashboard}
                                disabled={exporting}
                                className="flex items-center gap-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer shadow-sm shadow-brand-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <i className={`fi fi-rr-download text-xs leading-none ${exporting ? "animate-spin" : ""}`} />
                                <span>{exporting ? "Exporting..." : "Export"}</span>
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
                                : (
                                    <LowStockAlert
                                        data={lowStock}
                                        count={kpi?.lowStockCount}
                                        threshold={LOW_STOCK_THRESHOLD}
                                        onCardClick={() => navigate(`/admin/warehouse?view=low-stock&threshold=${LOW_STOCK_THRESHOLD}`)}
                                    />
                                )
                            }
                        </div>
                        <div className="lg:col-span-2">
                            {loading
                                ? <SkeletonChart height="h-64" />
                                : <ActivityFeed data={activityFeed} />
                            }
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