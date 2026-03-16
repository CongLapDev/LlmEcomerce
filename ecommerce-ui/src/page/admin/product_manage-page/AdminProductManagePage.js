import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Space, Input, Pagination } from "antd";
import { GlobalContext } from "../../../context";
import APIBase, { getImageUrl } from "../../../api/ApiBase";
import PlaceHolder from "../../../assets/image/product_placeholder.png";
import { getProducts } from "../../../services/adminManageService";

import AdminLayout from "../../../components/layout/AdminLayout";
import PageHeader from "../../../components/ui/PageHeader";
import CardContainer from "../../../components/ui/CardContainer";
import DataTable from "../../../components/ui/DataTable";
import ActionButton from "../../../components/ui/ActionButton";
import StatusBadge from "../../../components/ui/StatusBadge";
import ProductFilter from "../../../part/admin/product-filter/ProductFilter";

function AdminProductManagePage() {
    const globalContext = useContext(GlobalContext);
    const navigate = useNavigate();
    const [page, setPage] = useState({ page: 0, size: 10 });
    const [filter, setFilter] = useState({});
    const [productsData, setProductsData] = useState({ content: [], totalElements: 0 });
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [showFilter, setShowFilter] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getProducts(page.page, page.size, filter);
            setProductsData(data);
        } catch (error) {
            globalContext.message.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page.page, page.size, filter]);

    const handleFilterChange = (value) => {
        const cleanedValue = { ...value };
        if (cleanedValue.options) {
            cleanedValue.options = cleanedValue.options.map(opt => opt.id);
        }
        Object.keys(cleanedValue).forEach(key => {
            if (!cleanedValue[key]) delete cleanedValue[key];
        });

        if (Array.isArray(cleanedValue.category) && cleanedValue.category.length === 2) {
            cleanedValue.category = cleanedValue.category[cleanedValue.category.length - 1];
        }

        setFilter(cleanedValue);
        setPage({ ...page, page: 0 }); // reset to first page
    };

    const handleSearch = () => {
        handleFilterChange({ ...filter, name: searchText });
    };

    const columns = [
        {
            title: "Product",
            key: "product",
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <img
                        src={getImageUrl(record.picture) || PlaceHolder}
                        alt={record.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                    />
                    <div>
                        <Link to={`/admin/product?id=${record.id}`} className="font-semibold text-brand-600 hover:text-brand-700 transition-colors block">
                            {record.name}
                        </Link>
                        <span className="text-[10px] text-slate-400 max-w-[200px] truncate block">
                            {record.description || "No description"}
                        </span>
                    </div>
                </div>
            )
        },
        {
            title: "Category",
            dataIndex: ["category", "name"],
            key: "category",
            render: (text) => text ? <span className="text-slate-600 font-medium">{text}</span> : <span className="text-slate-400">-</span>
        },
        {
            title: "Price",
            key: "price",
            render: (_, record) => {
                // If options logic exists, try to get min price or base price
                const priceMatch = record.options?.[0]?.price || 0;
                return <span className="font-semibold text-slate-700 font-heading">${priceMatch.toLocaleString()}</span>;
            }
        },
        {
            title: "Status",
            key: "status",
            render: (_, record) => {
                // Determine mock stock status based on active or arbitrary field if stock isn't present
                const isActive = record.active !== false;
                return <StatusBadge status={isActive ? "active" : "inactive"} label={isActive ? "In Stock" : "Out of Stock"} />;
            }
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
                        onClick={() => navigate(`/admin/product?id=${record.id}`)}
                    />
                    <ActionButton
                        variant="ghost"
                        danger
                        icon="fi fi-rr-trash"
                        onClick={() => {}} // Hookup to delete API
                    />
                </Space>
            )
        }
    ];

    const actions = (
        <>
            <Input
                placeholder="Search products..."
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
                onClick={() => window.open(`${APIBase.getUri()}/api/v1/product/xlsx?${new URLSearchParams(filter).toString()}`, '_blank')}
            />
            <ActionButton
                variant="primary"
                icon="fi fi-rr-plus"
                label="Add Product"
                onClick={() => {}} // Add logic or routing to /admin/product-add
            />
        </>
    );

    return (
        <AdminLayout>
            <PageHeader 
                title="Product Management" 
                subtitle="Manage your inventory, prices, and variants" 
                actions={actions} 
            />

            <div className="flex flex-col xl:flex-row gap-6 items-start">
                {/* Optional Filters Sidebar */}
                {showFilter && (
                    <div className="w-full xl:w-64 flex-shrink-0 animate-fade-in transition-all">
                        <CardContainer className="p-4 sticky top-24">
                            <h3 className="font-semibold text-slate-800 font-heading mb-4 text-sm">Advanced Filters</h3>
                            <ProductFilter onFilter={handleFilterChange} />
                        </CardContainer>
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <CardContainer>
                        <DataTable
                            columns={columns}
                            dataSource={productsData?.content || []}
                            rowKey="id"
                            loading={loading}
                            pagination={false}
                        />
                        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-xs text-slate-500 font-body">
                                Showing <span className="font-semibold">{productsData?.content?.length || 0}</span> products
                            </p>
                            <Pagination 
                                current={page.page + 1} 
                                pageSize={page.size} 
                                total={productsData?.totalElements || 0}
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

export default AdminProductManagePage;