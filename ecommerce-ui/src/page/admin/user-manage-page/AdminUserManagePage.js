import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Space, Input, Pagination } from "antd";
import { GlobalContext } from "../../../context";
import { getUsers } from "../../../services/adminManageService";
import { formatDate } from "../../../utils/dateFormatter";

import AdminLayout from "../../../components/layout/AdminLayout";
import PageHeader from "../../../components/ui/PageHeader";
import CardContainer from "../../../components/ui/CardContainer";
import DataTable from "../../../components/ui/DataTable";
import ActionButton from "../../../components/ui/ActionButton";
import StatusBadge from "../../../components/ui/StatusBadge";
import UserFilter from "../../../part/admin/user-filter/UserFilter";

function AdminUserManagePage() {
    const globalContext = useContext(GlobalContext);
    const navigate = useNavigate();
    const [page, setPage] = useState({ page: 0, size: 10 });
    const [filter, setFilter] = useState({});
    const [usersData, setUsersData] = useState({ content: [], totalElements: 0 });
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [showFilter, setShowFilter] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers(page.page, page.size, filter);
            setUsersData(data);
        } catch (error) {
            globalContext.message.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page.page, page.size, filter]);

    const handleFilterChange = (value) => {
        const cleanedValue = { ...value };
        Object.keys(cleanedValue).forEach(key => {
            if (!cleanedValue[key]) delete cleanedValue[key];
        });
        setFilter(cleanedValue);
        setPage({ ...page, page: 0 });
    };

    const handleSearch = () => {
        // Mock generic search for email/name
        handleFilterChange({ ...filter, search: searchText });
    };

    const columns = [
        {
            title: "User",
            key: "user",
            render: (_, record) => {
                const name = `${record.firstname} ${record.lastname}`;
                const initials = name.split(" ").slice(-2).map(n => n?.[0]).join("").toUpperCase();
                const hue = name.charCodeAt(0) * 37 % 360;
                return (
                    <div className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold font-heading"
                            style={{ backgroundColor: `hsl(${hue}, 60%, 45%)` }}
                        >
                            {initials || "U"}
                        </div>
                        <div>
                            <Link to={`/admin/user?id=${record.id}`} className="font-semibold text-brand-600 hover:text-brand-700 transition-colors block leading-tight">
                                {name}
                            </Link>
                            <span className="text-[10px] text-slate-400 block">{record.email}</span>
                        </div>
                    </div>
                );
            }
        },
        {
            title: "Contact",
            key: "contact",
            render: (_, record) => (
                <span className="text-xs text-slate-600 font-body">{record.phone || "No phone"}</span>
            )
        },
        {
            title: "Demographics",
            key: "demographics",
            render: (_, record) => (
                <div>
                    <p className="text-xs text-slate-600 capitalize">{record.gender || "-"}</p>
                    <p className="text-[10px] text-slate-400">DOB: {formatDate(record.dob) || "-"}</p>
                </div>
            )
        },
        {
            title: "Status",
            key: "status",
            render: (_, record) => {
                const statusStr = record.account?.status || "active"; // Fallback to active
                return <StatusBadge status={statusStr} />;
            }
        },
        {
            title: "Action",
            key: "action",
            width: 150,
            render: (_, record) => (
                <Space>
                    <ActionButton
                        variant="secondary"
                        icon="fi fi-rr-edit"
                        onClick={() => navigate(`/admin/user?id=${record.id}`)}
                    />
                    {record.account?.status === 'locked' ? (
                        <ActionButton
                            variant="primary"
                            icon="fi fi-rr-unlock"
                            onClick={() => {}} // Hookup to unlock API
                            className="bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                        />
                    ) : (
                        <ActionButton
                            variant="secondary"
                            danger
                            icon="fi fi-rr-lock"
                            onClick={() => {}} // Hookup to lock API 
                        />
                    )}
                </Space>
            )
        }
    ];

    const listData = Array.isArray(usersData?.content) ? usersData.content.map((user_, key) => ({
        ...user_,
        key: user_.id || key,
        dob: user_.dateOfBirth 
    })) : [];

    const actions = (
        <>
            <Input
                placeholder="Search users..."
                prefix={<i className="fi fi-rr-search text-slate-400"></i>}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={handleSearch}
                className="rounded-xl border-slate-200 hover:border-brand-400 focus:border-brand-500 w-64 text-sm"
                allowClear
            />
            <ActionButton 
                variant={showFilter ? "primary" : "secondary"} 
                icon="fi fi-rr-settings-sliders" 
                label="Filters" 
                onClick={() => setShowFilter(!showFilter)} 
            />
        </>
    );

    return (
        <AdminLayout>
            <PageHeader 
                title="User Management" 
                subtitle="View and manage customer accounts and permissions" 
                actions={actions} 
            />

            <div className="flex flex-col xl:flex-row gap-6 items-start">
                {showFilter && (
                    <div className="w-full xl:w-64 flex-shrink-0 animate-fade-in transition-all">
                        <CardContainer className="p-4 sticky top-24">
                            <h3 className="font-semibold text-slate-800 font-heading mb-4 text-sm">Filter Users</h3>
                            <UserFilter onFilter={handleFilterChange} />
                        </CardContainer>
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <CardContainer>
                        <DataTable
                            columns={columns}
                            dataSource={listData}
                            rowKey="id"
                            loading={loading}
                            pagination={false}
                        />
                        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-xs text-slate-500 font-body">
                                Showing <span className="font-semibold">{listData.length}</span> users
                            </p>
                            <Pagination 
                                current={page.page + 1} 
                                pageSize={page.size} 
                                total={usersData?.totalElements || 0}
                                onChange={(p, s) => setPage({ page: p - 1, size: s })}
                                showSizeChanger
                            />
                        </div>
                    </CardContainer>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminUserManagePage;