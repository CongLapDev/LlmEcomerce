import { Link } from "react-router-dom";
// No mock data — data is passed entirely as a prop from DashboardPage

function Avatar({ name }) {
    const safeName = typeof name === "string" ? name : "User";
    const initials = safeName
        .split(" ")
        .slice(-2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    // Pick a deterministic hue from name
    const hue = safeName.charCodeAt(0) * 37 % 360;
    return (
        <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold font-heading"
            style={{ backgroundColor: `hsl(${hue}, 60%, 45%)` }}
        >
            {initials}
        </div>
    );
}

function TopCustomers({ data = [] }) {
    const list = Array.isArray(data) ? data : [];
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-semibold font-heading text-slate-800">Top Customers</h3>
                    <p className="text-xs text-slate-400 font-body mt-0.5">By total spend this period</p>
                </div>
                <Link to="/admin/user/manage" className="text-xs text-brand-600 hover:text-brand-700 font-medium font-body transition-colors duration-150">
                    View all →
                </Link>
            </div>

            <ul className="space-y-3">
                {list.map((u, i) => (
                    <li key={u.id} className="flex items-center gap-3">
                        <span className={`flex-shrink-0 w-6 text-xs font-bold font-heading text-right ${i === 0 ? "text-amber-500" : i === 1 ? "text-slate-400" : i === 2 ? "text-amber-700" : "text-slate-300"}`}>
                            #{i + 1}
                        </span>
                        <Avatar name={u?.name} />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-700 truncate font-body">{u?.name ?? "Unknown User"}</p>
                            <p className="text-[10px] text-slate-400 font-body truncate">{u.email}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="text-xs font-bold font-heading text-slate-700">
                                ${((u?.totalSpend ?? 0) / 1000).toFixed(1)}k
                            </p>
                            <p className="text-[10px] text-slate-400 font-body">{u?.orders ?? 0} orders</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TopCustomers;
