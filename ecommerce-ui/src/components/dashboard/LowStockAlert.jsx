// No mock data — data is passed entirely as a prop from DashboardPage

function StockBar({ stock, threshold }) {
    const pct = Math.min((stock / threshold) * 100, 100);
    const color = pct < 50 ? "bg-red-500" : pct < 75 ? "bg-amber-500" : "bg-emerald-500";
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${color}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className={`text-[10px] font-bold font-heading flex-shrink-0 ${
                pct < 50 ? "text-red-500" : pct < 75 ? "text-amber-600" : "text-emerald-600"
            }`}>
                {stock}
            </span>
        </div>
    );
}

function LowStockAlert({ data = [] }) {
    const list = Array.isArray(data) ? data : [];
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    <i className="fi fi-rr-triangle-warning text-red-500 text-sm leading-none" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold font-heading text-slate-800">Low Stock Alert</h3>
                    <p className="text-xs text-slate-400 font-body">
                        {list.length} product{list.length !== 1 ? "s" : ""} below threshold
                    </p>
                </div>
            </div>

            <ul className="space-y-4">
                {list.map((item) => (
                    <li key={item.id}>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-slate-700 font-body truncate">{item?.name ?? "Unknown Product"}</p>
                                <p className="text-[10px] text-slate-400 font-body">{item?.sku ?? "-"} · {item?.category ?? "-"}</p>
                            </div>
                            <span className={`flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-lg font-body ${
                                item?.stock < (item?.threshold ?? 1) * 0.5
                                    ? "bg-red-50 text-red-600"
                                    : "bg-amber-50 text-amber-600"
                            }`}>
                                {item?.stock < (item?.threshold ?? 1) * 0.5 ? "Critical" : "Warning"}
                            </span>
                        </div>
                        <StockBar stock={item?.stock ?? 0} threshold={item?.threshold ?? 10} />
                        <p className="text-[10px] text-slate-400 font-body mt-0.5 text-right">
                            Threshold: {item?.threshold ?? 10}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LowStockAlert;
