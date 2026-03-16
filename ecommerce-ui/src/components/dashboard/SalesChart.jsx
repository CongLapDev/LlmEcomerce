import { useState } from "react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const RANGES = [
    { label: "7d", days: 7 },
    { label: "30d", days: 30 },
    { label: "90d", days: 90 },
];

function toISO(d) {
    return d.toISOString().split("T")[0];
}

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-slate-900 rounded-xl p-3 shadow-xl border border-slate-800 min-w-[140px]">
            <p className="text-xs text-slate-400 mb-2 font-body">{label}</p>
            {payload.map((entry) => (
                <div key={entry.dataKey} className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-300 font-body">{entry.name}</span>
                    <span className="text-xs font-bold font-heading" style={{ color: entry.color }}>
                        {entry.dataKey === "revenue"
                            ? "$" + Number(entry.value).toLocaleString()
                            : entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

/**
 * SalesChart
 * Props:
 *   data          – Array<{ date, revenue, orders }> from API
 *   onRangeChange – (from: string, to: string) => void  – called when user picks a range
 */
function SalesChart({ data = [], onRangeChange }) {
    const list = Array.isArray(data) ? data : [];
    const [activeRange, setActiveRange] = useState("30d");

    const handleRange = (range) => {
        setActiveRange(range.label);
        if (!onRangeChange) return;
        const to = new Date();
        const from = new Date();
        from.setDate(from.getDate() - range.days);
        onRangeChange(toISO(from), toISO(to));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="text-sm font-semibold font-heading text-slate-800">Sales Overview</h3>
                    <p className="text-xs text-slate-400 font-body mt-0.5">Revenue &amp; orders over time</p>
                </div>
                <div className="flex items-center gap-1.5">
                    {RANGES.map((r) => (
                        <button
                            key={r.label}
                            onClick={() => handleRange(r)}
                            className={`text-xs px-2.5 py-1 rounded-lg font-body transition-all duration-150 cursor-pointer ${
                                activeRange === r.label
                                    ? "bg-brand-600 text-white"
                                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            {list.length === 0 ? (
                <div className="h-52 flex items-center justify-center text-slate-400 text-xs font-body">
                    No sales data available for this period.
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={list} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.12} />
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.12} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="revenue" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                        <YAxis yAxisId="orders" orientation="right" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }} />
                        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12, fontFamily: "'Fira Sans', sans-serif" }} />
                        <Area yAxisId="revenue" type="monotone" dataKey="revenue" name="Revenue" stroke="#2563eb" strokeWidth={2} fill="url(#colorRevenue)" dot={false} activeDot={{ r: 4, fill: "#2563eb" }} />
                        <Area yAxisId="orders" type="monotone" dataKey="orders" name="Orders" stroke="#f97316" strokeWidth={2} fill="url(#colorOrders)" dot={false} activeDot={{ r: 4, fill: "#f97316" }} />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

export default SalesChart;
