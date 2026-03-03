import { useContext, useState, useEffect, useMemo } from "react";
import { GlobalContext } from "../../../context";
import APIBase from "../../../api/ApiBase";
import { Card, Table, Button, Space, Input, Row, Col, Tag, Popconfirm } from "antd";
import { Link } from "react-router-dom";
import CategoryAddRootModal from "../../../part/admin/category/CategoryAddRootModal";
import CategoryEditModal from "../../../part/admin/category/CategoryEditModal";
import PrefixIcon from "../../../components/prefix-icon/PrefixIcon";
import { deleteCategory } from "../../../api/category";
import styles from "./style.module.scss";

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

    const fetchData = () => {
        setLoading(true);
        globalContext.loader(true);

        APIBase.get("api/v1/category/1")
            .then((payload) => {
                const rootNode = payload.data;
                const allNodes = Array.isArray(rootNode?.children) ? rootNode.children : [];

                let rootCategories = allNodes.filter((node) => getParentId(node) == null);

                if (rootCategories.length === 0 && rootNode?.id != null) {
                    rootCategories = allNodes.filter((node) => getParentId(node) === rootNode.id);
                }

                setCategories(rootCategories);
            })
            .catch((err) => {
                console.error(err);
                globalContext.message.error("Failed to load categories");
            })
            .finally(() => {
                setLoading(false);
                globalContext.loader(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddCategory = () => {
        fetchData();
    };

    const handleEditCategory = () => {
        fetchData();
    };

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
                <Link to={`/admin/category/${record.id}`} style={{ fontWeight: 500 }}>
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
            render: (text) => text || "-",
        },
        {
            title: "Children",
            key: "children",
            width: 100,
            render: (_, record) => {
                const count = Array.isArray(record.children) ? record.children.length : 0;
                if (count === 0) return <Tag>-</Tag>;
                return <Tag color="blue">{count}</Tag>;
            },
        },
        {
            title: "Actions",
            key: "actions",
            width: 200,
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<PrefixIcon><i className="fi fi-rr-edit"></i></PrefixIcon>}
                        size="small"
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete category"
                        description={`Are you sure you want to delete "${record.name}"? This action cannot be undone.`}
                        onConfirm={() => handleDeleteCategory(record.id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            danger
                            icon={<PrefixIcon><i className="fi fi-rr-trash"></i></PrefixIcon>}
                            size="small"
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title={
                <Row justify="space-between" align="middle">
                    <Col>
                        <span style={{ fontSize: "20px", fontWeight: 500 }}>
                            Category Management
                        </span>
                    </Col>
                    <Col>
                        <Space>
                            <Input
                                placeholder="Search categories..."
                                prefix={<PrefixIcon><i className="fi fi-rr-search"></i></PrefixIcon>}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ width: 250 }}
                                allowClear
                            />
                            <Button
                                icon={<PrefixIcon><i className="fi fi-rr-refresh"></i></PrefixIcon>}
                                onClick={fetchData}
                            >
                                Refresh
                            </Button>
                            <Button
                                type="primary"
                                icon={<PrefixIcon><i className="fi fi-rr-plus"></i></PrefixIcon>}
                                onClick={() => setAddModalVisible(true)}
                            >
                                Add Root Category
                            </Button>
                        </Space>
                    </Col>
                </Row>
            }
        >
            <div className={styles.categoryTable}>
                <Table
                    columns={columns}
                    dataSource={filteredCategories}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} categories`,
                    }}
                    bordered
                    childrenColumnName="children"
                    expandable={{
                        defaultExpandAllRows: false,
                        expandRowByClick: false,
                        indentSize: 24,
                    }}
                    onRow={() => ({
                        style: {
                            transition: "all 0.25s ease-in-out",
                        },
                    })}
                />
            </div>

            <CategoryAddRootModal
                state={addModalVisible}
                setState={setAddModalVisible}
                onAdd={handleAddCategory}
            />

            {selectedCategory && (
                <CategoryEditModal
                    state={editModalVisible}
                    setState={setEditModalVisible}
                    category={selectedCategory}
                    onUpdate={handleEditCategory}
                />
            )}
        </Card>
    );
}

export default AdminCategoryManagePage;
