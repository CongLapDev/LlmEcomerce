import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
// No mock data — data is passed entirely as a prop from DashboardPage

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-slate-900 rounded-xl p-3 shadow-xl border border-slate-800">
            <p className="text-xs text-slate-400 mb-1 font-body">{label}</p>
            <p className="text-xs font-bold text-emerald-400 font-heading">+{payload[0]?.value?.toLocaleString()} new</p>
            <p className="text-xs text-slate-300 font-body">{payload[1]?.value?.toLocaleString()} total</p>
        </div>
    );
};

function UserGrowthChart({ data = [] }) {
    const list = Array.isArray(data) ? data : [];
    const latest = list[list.length - 1];
    const prev = list[list.length - 2];
    const growth = prev?.newUsers ? (((latest.newUsers - prev.newUsers) / prev.newUsers) * 100).toFixed(1) : 0;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h3 className="text-sm font-semibold font-heading text-slate-800">User Growth</h3>
                    <p className="text-xs text-slate-400 font-body mt-0.5">Monthly registrations</p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold font-heading text-slate-800">
                        {latest?.totalUsers?.toLocaleString()}
                    </p>
                    <p className={`text-xs font-medium font-body ${Number(growth) >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {Number(growth) >= 0 ? "+" : ""}{growth}% MoM
                    </p>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
                <LineChart data={list} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }} />
                    <Line type="monotone" dataKey="newUsers" name="New Users" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", strokeWidth: 0, r: 3 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="totalUsers" name="Total" stroke="#2563eb" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default UserGrowthChart;
