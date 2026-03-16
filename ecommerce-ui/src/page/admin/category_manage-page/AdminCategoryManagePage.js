import React, { useContext, useState, useEffect, useMemo } from "react";
import { GlobalContext } from "../../../context";
import { Space, Input, Tag, Popconfirm } from "antd";
import { Link } from "react-router-dom";
import CategoryAddRootModal from "../../../part/admin/category/CategoryAddRootModal";
import CategoryEditModal from "../../../part/admin/category/CategoryEditModal";
import { deleteCategory } from "../../../api/category";
import { getCategories } from "../../../services/adminManageService";

import AdminLayout from "../../../components/layout/AdminLayout";
import PageHeader from "../../../components/ui/PageHeader";
import CardContainer from "../../../components/ui/CardContainer";
import DataTable from "../../../components/ui/DataTable";
import ActionButton from "../../../components/ui/ActionButton";

const getParentId = (category) => {
    if (!category) return null;
    if (category.parent && category.parent.id != null) return category.parent.id;
    if (category.parent_id != null) return category.parent_id;
    if (category.parentId != null) return category.parentId;
    return null;
};

const filterTreeBySearch = (nodes = [], keyword = "") => {
    if (!keyword.trim()) return nodes;

    const normalized = keyword.toLowerCase();
    return nodes.reduce((acc, node) => {
        if (!node) return acc;

        const ownMatch =
            node.name?.toLowerCase().includes(normalized) ||
            node.description?.toLowerCase().includes(normalized);

        const filteredChildren = filterTreeBySearch(node.children || [], keyword);
        if (ownMatch || filteredChildren.length > 0) {
            acc.push({
                ...node,
                children: ownMatch ? (node.children || []) : filteredChildren,
            });
        }

        return acc;
    }, []);
};

function AdminCategoryManagePage() {
    const globalContext = useContext(GlobalContext);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchText, setSearchText] = useState("");

    const fetchData = async () => {
        setLoading(true);
        globalContext.loader(true);

        const rootNode = await getCategories();
        const allNodes = Array.isArray(rootNode?.children) ? rootNode.children : [];

        let rootCategories = allNodes.filter((node) => getParentId(node) == null);

        if (rootCategories.length === 0 && rootNode?.id != null) {
            rootCategories = allNodes.filter((node) => getParentId(node) === rootNode.id);
        }

        setCategories(rootCategories);
        setLoading(false);
        globalContext.loader(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteCategory = async (categoryId) => {
        try {
            globalContext.loader(true);
            await deleteCategory(categoryId);
            globalContext.message.success("Category deleted successfully");
            fetchData();
        } catch (error) {
            console.error(error);
            globalContext.message.error("Failed to delete category");
        } finally {
            globalContext.loader(false);
        }
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setEditModalVisible(true);
    };

    const filteredCategories = useMemo(() => {
        return filterTreeBySearch(categories, searchText);
    }, [categories, searchText]);

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name?.localeCompare(b.name),
            render: (text, record) => (
                <Link to={`/admin/category/${record.id}`} className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                    {text}
                </Link>
            ),
        },
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 100,
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
            render: (text) => <span className="text-slate-500">{text || "-"}</span>,
        },
        {
            title: "Children",
            key: "children",
            width: 100,
            render: (_, record) => {
                const count = Array.isArray(record.children) ? record.children.length : 0;
                if (count === 0) return <span className="text-slate-400">-</span>;
                return <Tag color="blue" className="rounded-lg px-2 border-transparent bg-blue-50 text-blue-600 font-semibold">{count}</Tag>;
            },
        },
        {
            title: "Actions",
            key: "actions",
            width: 200,
            render: (_, record) => (
                <Space>
                    <ActionButton
                        variant="secondary"
                        icon="fi fi-rr-edit"
                        label="Edit"
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title="Delete category"
                        description={`Are you sure you want to delete "${record.name}"?`}
                        onConfirm={() => handleDeleteCategory(record.id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <ActionButton
                            variant="secondary"
                            danger
                            icon="fi fi-rr-trash"
                            label="Delete"
                            onClick={() => {}} // Popconfirm handles click
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const actions = (
        <>
            <Input
                placeholder="Search categories..."
                prefix={<i className="fi fi-rr-search text-slate-400"></i>}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="rounded-xl border-slate-200 hover:border-brand-400 focus:border-brand-500 w-64 text-sm"
                allowClear
            />
            <ActionButton
                variant="secondary"
                icon="fi fi-rr-refresh"
                label="Refresh"
                onClick={fetchData}
            />
            <ActionButton
                variant="primary"
                icon="fi fi-rr-plus"
                label="Add Root Category"
                onClick={() => setAddModalVisible(true)}
            />
        </>
    );

    return (
        <AdminLayout>
            <PageHeader 
                title="Category Management" 
                subtitle="Organize product categories and hierarchy" 
                actions={actions} 
            />

            <CardContainer>
                <DataTable
                    columns={columns}
                    dataSource={filteredCategories}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} categories`,
                    }}
                    childrenColumnName="children"
                    expandable={{
                        defaultExpandAllRows: false,
                        expandRowByClick: false,
                        indentSize: 24,
                    }}
                />
            </CardContainer>

            <CategoryAddRootModal
                state={addModalVisible}
                setState={setAddModalVisible}
                onAdd={fetchData}
            />

            {selectedCategory && (
                <CategoryEditModal
                    state={editModalVisible}
                    setState={setEditModalVisible}
                    category={selectedCategory}
                    onUpdate={fetchData}
                />
            )}
        </AdminLayout>
    );
}

export default AdminCategoryManagePage;
