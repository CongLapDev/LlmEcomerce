import { Link } from "react-router-dom";
// No mock data — data is passed entirely as a prop from DashboardPage

const STATUS_CONFIG = {
    delivered: { label: "Delivered", classes: "bg-emerald-50 text-emerald-700" },
    shipped: { label: "Shipped", classes: "bg-blue-50 text-blue-700" },
    processing: { label: "Processing", classes: "bg-amber-50 text-amber-700" },
    cancelled: { label: "Cancelled", classes: "bg-red-50 text-red-600" },
};

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] || { label: status, classes: "bg-slate-100 text-slate-600" };
    return (
        <span className={`inline-flex items-center text-[10px] font-semibold font-body px-2 py-0.5 rounded-lg uppercase tracking-wide ${cfg.classes}`}>
            {cfg.label}
        </span>
    );
}

function RecentOrdersTable({ data = [] }) {
    const list = Array.isArray(data) ? data : [];
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div>
                    <h3 className="text-sm font-semibold font-heading text-slate-800">Recent Orders</h3>
                    <p className="text-xs text-slate-400 font-body mt-0.5">Latest {list.length} transactions</p>
                </div>
                <Link to="/admin/order-manage" className="text-xs text-brand-600 hover:text-brand-700 font-medium font-body transition-colors duration-150">
                    View all →
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="text-left px-5 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest font-body">Order</th>
                            <th className="text-left px-5 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest font-body">Customer</th>
                            <th className="text-left px-5 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest font-body hidden md:table-cell">Product</th>
                            <th className="text-left px-5 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest font-body">Amount</th>
                            <th className="text-left px-5 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest font-body">Status</th>
                            <th className="text-left px-5 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest font-body hidden lg:table-cell">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((order, i) => (
                            <tr
                                key={order.id}
                                className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors duration-150 cursor-pointer"
                            >
                                <td className="px-5 py-3.5">
                                    <span className="font-mono font-semibold text-brand-600 text-xs">{order?.id ?? "N/A"}</span>
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className="text-slate-700 font-body font-medium">{order?.customer ?? "Unknown"}</span>
                                </td>
                                <td className="px-5 py-3.5 hidden md:table-cell">
                                    <span className="text-slate-500 font-body truncate max-w-[160px] block">{order?.product ?? "Unknown Product"}</span>
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className="font-heading font-bold text-slate-700">${(order?.amount ?? 0).toLocaleString()}</span>
                                </td>
                                <td className="px-5 py-3.5">
                                    <StatusBadge status={order?.status ?? "processing"} />
                                </td>
                                <td className="px-5 py-3.5 hidden lg:table-cell">
                                    <span className="text-slate-400 font-body">{order?.date ?? "-"}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RecentOrdersTable;
