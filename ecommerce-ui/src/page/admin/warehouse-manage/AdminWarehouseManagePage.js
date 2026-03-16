import React, { useContext, useEffect, useState } from "react";
import { Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../../context";
import { getWarehouses } from "../../../services/adminManageService";

import AdminLayout from "../../../components/layout/AdminLayout";
import PageHeader from "../../../components/ui/PageHeader";
import CardContainer from "../../../components/ui/CardContainer";
import DataTable from "../../../components/ui/DataTable";
import ActionButton from "../../../components/ui/ActionButton";
import StatusBadge from "../../../components/ui/StatusBadge";

function AdminWarehouseManagePage() {
    const globalContext = useContext(GlobalContext);
    const navigate = useNavigate();
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWarehouses = async () => {
        setLoading(true);
        try {
            const data = await getWarehouses();
            setWarehouses(data);
        } catch (error) {
            globalContext.message.error("Failed to load warehouses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const columns = [
        {
            title: "Warehouse Name",
            key: "name",
            render: (_, record) => (
                <Link to={`/admin/warehouse/detail?id=${record.id}`} className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                    {record.name}
                </Link>
            )
        },
        {
            title: "Details",
            dataIndex: "detail",
            key: "detail",
            render: (text) => <span className="text-slate-500 text-xs truncate max-w-[250px] block">{text || "-"}</span>
        },
        {
            title: "Location",
            key: "location",
            render: (_, record) => {
                if (!record.address) return <span className="text-slate-400 italic">No address</span>;
                const { building, city, addressLine1, addressLine2 } = record.address;
                const fullAddress = [building, addressLine1, addressLine2, city].filter(Boolean).join(", ");
                return (
                    <div className="flex items-start gap-2 max-w-[300px]">
                        <i className="fi fi-rr-marker text-slate-400 mt-0.5"></i>
                        <span className="text-xs text-slate-600 font-body leading-snug">{fullAddress}</span>
                    </div>
                );
            }
        },
        {
            title: "Status",
            key: "status",
            render: () => <StatusBadge status="active" label="Operational" /> // Mock status since API doesn't provide one
        },
        {
            title: "Actions",
            key: "actions",
            width: 150,
            render: (_, record) => (
                <Space>
                    <ActionButton
                        variant="secondary"
                        icon="fi fi-rr-edit"
                        onClick={() => navigate(`/admin/warehouse/detail?id=${record.id}`)}
                    />
                    <ActionButton
                        variant="ghost"
                        danger
                        icon="fi fi-rr-trash"
                        onClick={() => {}} // Hook up delete action
                    />
                </Space>
            )
        }
    ];

    const actions = (
        <>
            <ActionButton
                variant="secondary"
                icon="fi fi-rr-refresh"
                label="Refresh"
                onClick={fetchWarehouses}
            />
            <ActionButton
                variant="primary"
                icon="fi fi-rr-plus"
                label="Add Warehouse"
                onClick={() => {}} // Add logic or routing to /admin/warehouse-add
            />
        </>
    );

    return (
        <AdminLayout>
            <PageHeader 
                title="Warehouse Management" 
                subtitle="Manage your inventory hubs and storage locations" 
                actions={actions} 
            />

            <CardContainer>
                <DataTable
                    columns={columns}
                    dataSource={warehouses}
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                />
            </CardContainer>
        </AdminLayout>
    );
}

export default AdminWarehouseManagePage;