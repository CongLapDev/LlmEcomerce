import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Space, Input, Pagination, Tag } from "antd";
import dayjs from "dayjs";
import APIBase from "../../../api/ApiBase";
import { GlobalContext } from "../../../context";
import { getOrders } from "../../../services/adminManageService";

import AdminLayout from "../../../components/layout/AdminLayout";
import PageHeader from "../../../components/ui/PageHeader";
import CardContainer from "../../../components/ui/CardContainer";
import DataTable from "../../../components/ui/DataTable";
import ActionButton from "../../../components/ui/ActionButton";
import StatusBadge from "../../../components/ui/StatusBadge";
import OrderFilter from "../../../part/admin/order-filter/OrderFilter";

function AdminOrderManagePage() {
    const globalContext = useContext(GlobalContext);
    const navigate = useNavigate();
    const [page, setPage] = useState({ page: 0, size: 10 });
    const [filter, setFilter] = useState({});
    const [ordersData, setOrdersData] = useState({ content: [], totalElements: 0 });
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [showFilter, setShowFilter] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getOrders(page.page, page.size, filter);
            setOrdersData(data);
        } catch (error) {
            globalContext.message.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page.page, page.size, filter]);

    const handleFilterChange = (value) => {
        const cleanedValue = { ...value };
        Object.keys(cleanedValue).forEach(key => {
            if (!cleanedValue[key]) delete cleanedValue[key];
        });
        if (cleanedValue.from) {
            cleanedValue.from = dayjs(cleanedValue.from).format("YYYY-MM-DD HH-mm-ss");
        }
        if (cleanedValue.to) {
            cleanedValue.to = dayjs(cleanedValue.to).format("YYYY-MM-DD HH-mm-ss");
        }
        setFilter(cleanedValue);
        setPage({ ...page, page: 0 });
    };

    const handleSearch = () => {
        // Mock search logic if backend supports it, e.g. searching by Order ID or User Email
        handleFilterChange({ ...filter, search: searchText });
    };

    const detailOrderColumns = [
        {
            title: "Product Name",
            dataIndex: "pdname",
            key: 'pdname',
            render: (text) => <span className="text-slate-600 font-medium text-xs">{text}</span>
        },
        {
            title: "Price",
            dataIndex: "price",
            key: 'price',
            render: (v) => <span className="text-slate-500 text-xs">${v.toLocaleString()}</span>
        },
        {
            title: "Option",
            dataIndex: "option",
            key: "option",
            render: (v) => <span className="text-slate-400 text-[10px]">{v}</span>
        },
        {
            title: "QTY",
            dataIndex: "qty",
            key: "qty",
            render: (v) => <span className="font-semibold text-slate-700 text-xs">{v}</span>
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            render: (v) => <span className="font-bold text-brand-600 font-heading text-xs">${v.toLocaleString()}</span>
        }
    ];

    const columns = [
        {
            title: "Order ID",
            key: "id",
            render: (_, record) => (
                <Link to={`/admin/order?id=${record.id}`} className="font-mono font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                    #{record.id}
                </Link>
            )
        },
        {
            title: "Customer",
            key: "customer",
            render: (_, record) => (
                <div>
                    <p className="font-semibold text-slate-700">{record.firstname} {record.lastname}</p>
                    <p className="text-[10px] text-slate-400">{record.phone}</p>
                </div>
            )
        },
        {
            title: "Shipping details",
            key: "shipping",
            render: (_, record) => (
                <div>
                    <p className="text-xs text-slate-600 truncate max-w-[200px]">{record.address}</p>
                    <Tag className="rounded-lg mt-1 text-[10px] border-slate-200 text-slate-500 bg-slate-50">{record.shipmethod || "Standard"}</Tag>
                </div>
            )
        },
        {
            title: "Total",
            key: "total",
            render: (_, record) => (
                <span className="font-bold text-slate-800 font-heading tracking-tight">
                    ${record.total.toLocaleString()}
                </span>
            )
        },
        {
            title: "Status",
            key: "status",
            render: (_, record) => record.statusComponent
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <ActionButton
                    variant="ghost"
                    icon="fi fi-rr-eye"
                    onClick={() => navigate(`/admin/order?id=${record.id}`)}
                />
            )
        }
    ];

    const listData = Array.isArray(ordersData?.content) ? ordersData.content.map((value, index) => ({
        key: index,
        id: value.id,
        firstname: value.user?.firstname || "",
        lastname: value.user?.lastname || "",
        phone: value.user?.phoneNumber || "",
        address: value.address?.addressLine1 || "",
        shipmethod: value.shippingMethod?.name || "",
        total: value.total || 0,
        statusComponent: value.status?.length > 0 ? (
            <StatusBadge status={value.status[value.status.length - 1].status} />
        ) : (
            <StatusBadge status="processing" />
        ),
        description: Array.isArray(value.orderLines) ? value.orderLines.map((orderLine) => ({
            pdname: orderLine.productItem?.product?.name || "Unknown",
            price: orderLine.productItem?.price || 0,
            option: Array.isArray(orderLine.productItem?.options) ? orderLine.productItem.options.map(opt => opt.value).join(",") : "",
            qty: orderLine.qty || 0,
            total: orderLine.total || 0
        })) : []
    })) : [];

    const actions = (
        <>
            <Input
                placeholder="Search orders..."
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
            <ActionButton
                variant="secondary"
                icon="fi fi-rr-file-excel"
                label="Export"
                onClick={() => window.open(`${APIBase.getUri()}/api/v1/order/xlsx?${new URLSearchParams(filter).toString()}`, '_blank')}
            />
        </>
    );

    return (
        <AdminLayout>
            <PageHeader 
                title="Order Management" 
                subtitle="Track, process, and manage customer orders" 
                actions={actions} 
            />

            <div className="flex flex-col xl:flex-row gap-6 items-start">
                {showFilter && (
                    <div className="w-full xl:w-64 flex-shrink-0 animate-fade-in transition-all">
                        <CardContainer className="p-4 sticky top-24">
                            <h3 className="font-semibold text-slate-800 font-heading mb-4 text-sm">Filter Orders</h3>
                            <OrderFilter onFilter={handleFilterChange} />
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
                            expandable={{
                                expandedRowRender: (record) => (
                                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg m-2">
                                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 font-body">Order Items</h4>
                                        <DataTable 
                                            columns={detailOrderColumns} 
                                            dataSource={record.description} 
                                            pagination={false} 
                                            rowKey={(line, i) => `${record.id}-line-${i}`}
                                        />
                                    </div>
                                ),
                                rowExpandable: (record) => Array.isArray(record.description) && record.description.length > 0
                            }}
                        />
                        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-xs text-slate-500 font-body">
                                Showing <span className="font-semibold">{listData.length}</span> orders
                            </p>
                            <Pagination 
                                current={page.page + 1} 
                                pageSize={page.size} 
                                total={ordersData?.totalElements || 0}
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

export default AdminOrderManagePage;