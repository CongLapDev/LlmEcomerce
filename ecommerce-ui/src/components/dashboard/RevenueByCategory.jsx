import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
// No mock data — data is passed entirely as a prop from DashboardPage

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
        <div className="bg-slate-900 rounded-xl p-3 shadow-xl border border-slate-800">
            <p className="text-xs font-bold text-white font-heading">{d.name}</p>
            <p className="text-xs text-slate-300 font-body">${d.amount?.toLocaleString()}</p>
            <p className="text-xs text-slate-400 font-body">{d.value}% of revenue</p>
        </div>
    );
};

const RADIAN = Math.PI / 180;
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (percent < 0.08) return null;
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

function RevenueByCategory({ data = [] }) {
    const list = Array.isArray(data) ? data : [];
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="mb-4">
                <h3 className="text-sm font-semibold font-heading text-slate-800">Revenue by Category</h3>
                <p className="text-xs text-slate-400 font-body mt-0.5">Distribution this period</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={list}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderLabel}
                        outerRadius={85}
                        innerRadius={42}
                        dataKey="value"
                        strokeWidth={2}
                        stroke="#fff"
                    >
                        {list.map((entry, i) => (
                            <Cell key={`cell-${i}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ fontSize: 11, fontFamily: "'Fira Sans', sans-serif" }}
                        formatter={(v) => <span className="text-slate-600">{v}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Category list */}
            <ul className="mt-2 space-y-1.5">
                {list.map((d) => (
                    <li key={d.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                            <span className="text-xs text-slate-600 font-body">{d.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-700 font-heading">
                            ${(d.amount / 1000).toFixed(0)}k
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RevenueByCategory;
