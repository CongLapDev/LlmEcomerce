// Mock data for ElectroAdmin Dashboard
// Replace these with real API calls to Spring Boot endpoints

export const mockKPIs = {
  totalRevenue: 2847920,
  revenueGrowth: 12.4,
  ordersToday: 248,
  ordersGrowth: 8.1,
  totalProducts: 1842,
  productsGrowth: 3.2,
  totalUsers: 15483,
  usersGrowth: 18.7,
};

export const mockSalesData = [
  { date: "Feb 14", revenue: 42000, orders: 128 },
  { date: "Feb 21", revenue: 58000, orders: 176 },
  { date: "Feb 28", revenue: 51000, orders: 154 },
  { date: "Mar 07", revenue: 73000, orders: 221 },
  { date: "Mar 14", revenue: 68000, orders: 206 },
  { date: "Mar 21", revenue: 91000, orders: 274 },
  { date: "Mar 28", revenue: 84000, orders: 253 },
  { date: "Apr 04", revenue: 107000, orders: 322 },
  { date: "Apr 11", revenue: 98000, orders: 294 },
  { date: "Apr 18", revenue: 124000, orders: 372 },
  { date: "Apr 25", revenue: 119000, orders: 357 },
  { date: "May 02", revenue: 143000, orders: 429 },
];

export const mockUserGrowth = [
  { month: "Oct", newUsers: 820, totalUsers: 9200 },
  { month: "Nov", newUsers: 940, totalUsers: 10140 },
  { month: "Dec", newUsers: 1120, totalUsers: 11260 },
  { month: "Jan", newUsers: 1340, totalUsers: 12600 },
  { month: "Feb", newUsers: 1180, totalUsers: 13780 },
  { month: "Mar", newUsers: 1703, totalUsers: 15483 },
];

export const mockRevenueByCategory = [
  { name: "Laptops", value: 38, amount: 1082000, color: "#2563eb" },
  { name: "Smartphones", value: 27, amount: 769000, color: "#3b82f6" },
  { name: "Audio", value: 14, amount: 399000, color: "#60a5fa" },
  { name: "Tablets", value: 11, amount: 313000, color: "#93c5fd" },
  { name: "Accessories", value: 10, amount: 285000, color: "#bfdbfe" },
];

export const mockTopProducts = [
  { id: 1, name: "MacBook Air M4 13\"", category: "Laptops", sold: 312, revenue: 406560, stock: 48, trend: "up" },
  { id: 2, name: "iPhone 16 Pro Max", category: "Smartphones", sold: 287, revenue: 344400, stock: 22, trend: "up" },
  { id: 3, name: "Sony WH-1000XM6", category: "Audio", sold: 234, revenue: 82290, stock: 67, trend: "up" },
  { id: 4, name: "iPad Pro 13\" M4", category: "Tablets", sold: 198, revenue: 257400, stock: 14, trend: "down" },
  { id: 5, name: "Samsung Galaxy S25 Ultra", category: "Smartphones", sold: 176, revenue: 193600, stock: 31, trend: "up" },
];

export const mockTopCustomers = [
  { id: 1, name: "Nguyen Van An", email: "an.nguyen@email.com", orders: 47, totalSpend: 128400, avatar: null },
  { id: 2, name: "Tran Thi Bich", email: "bich.tran@email.com", orders: 38, totalSpend: 94200, avatar: null },
  { id: 3, name: "Le Minh Cuong", email: "cuong.le@email.com", orders: 31, totalSpend: 76800, avatar: null },
  { id: 4, name: "Pham Thi Dung", email: "dung.pham@email.com", orders: 28, totalSpend: 62300, avatar: null },
  { id: 5, name: "Hoang Van Em", email: "em.hoang@email.com", orders: 24, totalSpend: 54900, avatar: null },
];

export const mockRecentOrders = [
  { id: "ORD-8821", customer: "Nguyen Van An", product: "MacBook Air M4", amount: 1299, status: "delivered", date: "2026-03-16" },
  { id: "ORD-8820", customer: "Tran Thi Bich", product: "iPhone 16 Pro Max", amount: 1199, status: "processing", date: "2026-03-16" },
  { id: "ORD-8819", customer: "Le Minh Cuong", product: "Sony WH-1000XM6", amount: 349, status: "shipped", date: "2026-03-15" },
  { id: "ORD-8818", customer: "Pham Thi Dung", product: "iPad Pro 13\"", amount: 1299, status: "delivered", date: "2026-03-15" },
  { id: "ORD-8817", customer: "Hoang Van Em", product: "Galaxy S25 Ultra", amount: 1099, status: "cancelled", date: "2026-03-15" },
  { id: "ORD-8816", customer: "Vu Thi Phuong", product: "AirPods Pro 3", amount: 249, status: "processing", date: "2026-03-14" },
  { id: "ORD-8815", customer: "Do Minh Quan", product: "MacBook Pro M4", amount: 1999, status: "shipped", date: "2026-03-14" },
];

export const mockLowStock = [
  { id: 1, name: "iPad Pro 13\" M4", stock: 14, threshold: 20, category: "Tablets", sku: "TAB-IPP13-M4" },
  { id: 2, name: "iPhone 16 Pro Max", stock: 22, threshold: 30, category: "Smartphones", sku: "PHN-IP16PM" },
  { id: 3, name: "LG OLED C4 65\"", stock: 8, threshold: 15, category: "TVs", sku: "TV-LGC465" },
  { id: 4, name: "Dell XPS 15 OLED", stock: 11, threshold: 20, category: "Laptops", sku: "LAP-DXP15" },
];

export const mockActivityFeed = [
  { id: 1, type: "order", message: "New order #ORD-8821 placed", time: "2 min ago", color: "blue" },
  { id: 2, type: "user", message: "New user registered: minh.nguyen@email.com", time: "8 min ago", color: "emerald" },
  { id: 3, type: "stock", message: "Low stock alert: LG OLED C4 65\" (8 remaining)", time: "15 min ago", color: "amber" },
  { id: 4, type: "order", message: "Order #ORD-8819 shipped successfully", time: "23 min ago", color: "blue" },
  { id: 5, type: "user", message: "New user registered: phuong.le@email.com", time: "31 min ago", color: "emerald" },
  { id: 6, type: "order", message: "Order #ORD-8817 cancelled by customer", time: "45 min ago", color: "red" },
];
