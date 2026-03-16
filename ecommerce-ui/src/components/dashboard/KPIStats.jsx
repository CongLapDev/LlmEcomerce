// No mock data — data is passed entirely as a prop from DashboardPage

const cards = [
    {
        label: "Total Revenue",
        key: "totalRevenue",
        growthKey: "revenueGrowth",
        icon: "fi fi-rr-sack-dollar",
        accent: "border-l-brand-600",
        iconBg: "bg-brand-50",
        iconColor: "text-brand-600",
        format: (v) =>
            "$" + Number(v).toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 1 }),
    },
    {
        label: "Orders Today",
        key: "ordersToday",
        growthKey: "ordersGrowth",
        icon: "fi fi-rr-shopping-cart",
        accent: "border-l-orange-500",
        iconBg: "bg-orange-50",
        iconColor: "text-orange-500",
        format: (v) => Number(v).toLocaleString("en-US"),
    },
    {
        label: "Total Products",
        key: "totalProducts",
        growthKey: "productsGrowth",
        icon: "fi fi-rr-box-open-full",
        accent: "border-l-emerald-500",
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
        format: (v) => Number(v).toLocaleString("en-US"),
    },
    {
        label: "Total Users",
        key: "totalUsers",
        growthKey: "usersGrowth",
        icon: "fi fi-rr-users",
        accent: "border-l-violet-500",
        iconBg: "bg-violet-50",
        iconColor: "text-violet-600",
        format: (v) =>
            Number(v).toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 1 }),
    },
];

function KPIStats({ data = null }) {
    return (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {cards.map((card, i) => {
                const value = data[card.key];
                const growth = data[card.growthKey];
                const positive = growth >= 0;

                return (
                    <div
                        key={card.key}
                        className={`bg-white rounded-xl border-l-4 ${card.accent} shadow-sm hover:shadow-md transition-all duration-200 p-5 cursor-default animate-fade-in`}
                        style={{ animationDelay: `${i * 60}ms` }}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-2 font-body">
                                    {card.label}
                                </p>
                                <p className="text-2xl font-bold font-heading text-slate-800 leading-none">
                                    {value != null ? card.format(value) : "—"}
                                </p>
                                <div className={`flex items-center gap-1 mt-2 text-xs font-medium font-body ${positive ? "text-emerald-600" : "text-red-500"}`}>
                                    <i className={`${positive ? "fi fi-rr-arrow-trend-up" : "fi fi-rr-arrow-trend-down"} text-xs leading-none`} />
                                    <span>{positive ? "+" : ""}{growth}% vs last month</span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-xl ${card.iconBg} flex-shrink-0`}>
                                <i className={`${card.icon} text-xl leading-none ${card.iconColor}`} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default KPIStats;
