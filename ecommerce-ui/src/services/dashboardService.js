/**
 * dashboardService.js
 * ─────────────────────────────────────────────────────────────
 * Service layer for the ElectroAdmin dashboard.
 * All functions call Spring Boot endpoints via APIBase (JWT auto-attached).
 * Incorporates defensive programming: safe fallbacks if API fails or returns null.
 */
import APIBase from "../api/ApiBase";

// ── KPI Statistics ──────────────────────────────────────────────────────────
export async function getDashboardStats() {
    const fallback = {
        totalRevenue: 0,
        revenueGrowthRate: 0,
        revenueGrowth: 0,
        ordersToday: 0,
        ordersTodayGrowth: 0,
        totalProducts: 0,
        productsGrowth: 0,
        totalUsers: 0,
        usersGrowthRate: 0,
        usersGrowth: 0,
        lowStockCount: 0,
        topProducts: [],
        topCustomers: [],
        categoryRevenue: [],
        lowStockAlerts: [],
        activityFeed: [],
    };
    try {
        const { data } = await APIBase.get("/admin/dashboard/stats");
        return data ?? fallback;
    } catch (err) {
        console.error("[dashboardService] getDashboardStats failed:", err);
        return fallback;
    }
}

// ── Sales Chart ─────────────────────────────────────────────────────────────
export async function getSalesChart({ from, to } = {}) {
    try {
        const params = {};
        if (from) params.from = from;
        if (to) params.to = to;
        const { data } = await APIBase.get("/admin/dashboard/sales", { params });
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error("[dashboardService] getSalesChart failed:", err);
        return [];
    }
}

// ── User Growth ─────────────────────────────────────────────────────────────
export async function getUserGrowth() {
    try {
        const { data } = await APIBase.get("/admin/dashboard/users-growth");
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error("[dashboardService] getUserGrowth failed:", err);
        return [];
    }
}

// ── Revenue by Category ─────────────────────────────────────────────────────
export async function getRevenueByCategory() {
    try {
        const { data } = await APIBase.get("/admin/dashboard/revenue-by-category");
        const safeData = Array.isArray(data) ? data : [];
        const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#1d4ed8"];
        return safeData.map((item, i) => ({
            color: COLORS[i % COLORS.length],
            ...item,
        }));
    } catch (err) {
        console.error("[dashboardService] getRevenueByCategory failed:", err);
        return [];
    }
}

// ── Top Products ─────────────────────────────────────────────────────────────
export async function getTopProducts({ limit = 5, from, to } = {}) {
    try {
        const params = { limit };
        if (from) params.from = from;
        if (to) params.to = to;
        const { data } = await APIBase.get("/admin/dashboard/top-products", { params });
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error("[dashboardService] getTopProducts failed:", err);
        return [];
    }
}

// ── Top Customers ─────────────────────────────────────────────────────────────
export async function getTopCustomers({ limit = 5 } = {}) {
    try {
        const { data } = await APIBase.get("/admin/dashboard/top-customers", {
            params: { limit },
        });
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error("[dashboardService] getTopCustomers failed:", err);
        return [];
    }
}

// ── Recent Orders ─────────────────────────────────────────────────────────────
export async function getRecentOrders({ limit = 10 } = {}) {
    try {
        const { data } = await APIBase.get("/admin/dashboard/recent-orders", {
            params: { limit },
        });
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error("[dashboardService] getRecentOrders failed:", err);
        return [];
    }
}

// ── Low Stock Products ────────────────────────────────────────────────────────
export async function getLowStockProducts(threshold = 5) {
    try {
        const { data } = await APIBase.get("/admin/dashboard/low-stock", {
            params: { threshold },
        });
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error("[dashboardService] getLowStockProducts failed:", err);
        return [];
    }
}
