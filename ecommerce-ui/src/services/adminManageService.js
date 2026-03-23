/**
 * adminManageService.js
 * ─────────────────────────────────────────────────────────────
 * Mock / actual API service for management pages (Products, Categories, Orders, Users, Warehouses)
 * All methods include defensive try/catch blocks.
 */
import APIBase from "../api/ApiBase";

// ── Categories ─────────────────────────────────────────────────────────────
export async function getCategories() {
    try {
        const { data } = await APIBase.get("/api/v1/category/1");
        return data; // normally a node with children
    } catch (err) {
        console.error("getCategories failed:", err);
        return { children: [] };
    }
}

// ── Products ────────────────────────────────────────────────────────────────
export async function getProducts(page = 0, size = 10, filterParams = {}) {
    try {
        const params = new URLSearchParams({ page, size, ...filterParams });
        const { data } = await APIBase.get(`/api/v1/product?${params.toString()}`);
        return data; // expected: { content: [], totalElements: 0 }
    } catch (err) {
        console.error("getProducts failed:", err);
        return { content: [], totalElements: 0 };
    }
}

/**
 * getAdminProducts - Fetch products with calculated min/max prices and stock info
 * Uses the new /api/v1/admin/products endpoint
 */
export async function getAdminProducts(page = 0, size = 10, filterParams = {}) {
    try {
        const params = new URLSearchParams({ page, size, ...filterParams });
        const { data } = await APIBase.get(`/api/v1/admin/products?${params.toString()}`);
        return data; // expected: { content: [], totalElements: 0, pageable: {...} }
    } catch (err) {
        console.error("getAdminProducts failed:", err);
        return { content: [], totalElements: 0 };
    }
}

// ── Orders ──────────────────────────────────────────────────────────────────
export async function getOrders(page = 0, size = 10, filterParams = {}) {
    try {
        const params = new URLSearchParams({ page, size, ...filterParams });
        const { data } = await APIBase.get(`/api/v1/order?${params.toString()}`);
        return data; // expected: { content: [], totalElements: 0 }
    } catch (err) {
        console.error("getOrders failed:", err);
        return { content: [], totalElements: 0 };
    }
}

// ── Warehouses ──────────────────────────────────────────────────────────────
export async function getWarehouses() {
    try {
        const { data } = await APIBase.get("/api/v1/warehouse");
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error("getWarehouses failed:", err);
        return [];
    }
}

// ── Users ───────────────────────────────────────────────────────────────────
export async function getUsers(page = 0, size = 10, filterParams = {}) {
    try {
        const params = new URLSearchParams({ page, size, ...filterParams });
        const { data } = await APIBase.get(`/api/v1/user?${params.toString()}`);
        return data; // expected: { content: [], totalElements: 0 }
    } catch (err) {
        console.error("getUsers failed:", err);
        return { content: [], totalElements: 0 };
    }
}
