import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Input, TreeSelect, Row, Col, Upload, Space } from "antd";
import PrefixIcon from "../../../components/prefix-icon/PrefixIcon.js";
import { GlobalContext } from "../../../context/index.js";
import APIBase from "../../../api/ApiBase.js";
import { useNavigate } from "react-router-dom";
import { Error } from "../../../components";

export default function ProductAddForm({ submitHandler, defaultCategory, trigger }) {
    const globalContext = useContext(GlobalContext);
    const navigate = useNavigate();
    const [categoryTree, setCategoryTree] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch categories từ API - Load full category tree
    useEffect(() => {
        setLoading(true);
        APIBase.get("api/v1/category/1")
            .then(payload => {
                const rootCategory = payload.data;
                if (rootCategory && rootCategory.children) {
                    // Convert categories thành tree structure cho TreeSelect
                    // Include parent categories as selectable nodes
                    const convertToTree = (categoryList) => {
                        return categoryList.map(category => {
                            const node = {
                                title: category.name,
                                value: category.id,
                                key: category.id,
                                // Parent categories are also selectable
                                selectable: true,
                            };
                            
                            // Recursively add children
                            if (category.children && category.children.length > 0) {
                                node.children = convertToTree(category.children);
                            }
                            
                            return node;
                        });
                    };
                    
                    const tree = convertToTree(rootCategory.children);
                    setCategoryTree(tree);
                }
            })
            .catch(err => {
                console.error("Error fetching categories:", err);
                globalContext.message.error("Failed to load categories");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const validateSchema = Yup.object().shape({
        name: Yup.string()
            .max(45, "Must be 45 characters or less")
            .required("Required"),
        description: Yup.string().required("Required"),
        category: Yup.number()
            .required("Category is required")
            .min(1, "Please select a valid category")
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            manufacturer: "",
            category: (defaultCategory && defaultCategory.id) || null,
            image: null
        },
        validationSchema: validateSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            // Validate category is selected
            if (!values.category || values.category === null) {
                formik.setFieldError("category", "Category is required");
                return;
            }

            // Debug log: Check image value BEFORE creating FormData
            console.log("SUBMIT values.image:", values.image);
            console.log("type:", typeof values.image);
            console.log("instanceof File:", values.image instanceof File);

            // Build product object as JSON string
            const productObj = {
                name: values.name,
                description: values.description || "",
                manufacturer: values.manufacturer || "",
                category: {
                    id: values.category
                }
            };
            
            // Create FormData
            const fd = new FormData();
            fd.append("product", JSON.stringify(productObj));

            // Append image if it's a File instance
            if (values.image instanceof File) {
                fd.append("image", values.image);
                console.log("APPENDED IMAGE:", values.image.name);
            } else {
                console.log("NO IMAGE APPENDED:", values.image);
            }
            
            // Log all FormData contents
            for (let p of fd.entries()) {
                console.log("FD:", p[0], p[1]);
            }
            
            if (submitHandler) {
                submitHandler(fd);
            } else {
                addProduct(fd);
            }
        },
    });

    // Update category khi defaultCategory thay đổi
    useEffect(() => {
        if (defaultCategory && defaultCategory.id) {
            formik.setFieldValue("category", defaultCategory.id);
        }
    }, [defaultCategory]);

    function addProduct(productFormData) {
        globalContext.loader(true);
        APIBase.post("api/v1/product", productFormData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(payload => {
                globalContext.message.success("Product created successfully");
                navigate(`/admin/product?id=${payload.data.id}`)
            })
            .catch((e) => {
                const errorMessage = e.response?.data?.message || 
                                   e.response?.data?.error || 
                                   e.message ||
                                   "Error creating product";
                globalContext.message.error(errorMessage);
                console.error("Product creation error:", e);
                console.error("Error response:", e.response?.data);
            })
            .finally(() => {
                globalContext.loader(false);
            })
    }

    // Expose submitForm để có thể trigger từ bên ngoài
    if (trigger) {
        trigger.current = formik.submitForm;
    }

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <Row gutter={[18, 32]}>
                    {/* Image Upload */}
                    <Col span={12}>
                        <Row><label>Image</label></Row>
                        <Upload 
                            action=""
                            name="image" 
                            listType="picture"
                            maxCount={1}
                            beforeUpload={() => false}
                            fileList={formik.values.image ? [{
                                uid: '-1',
                                name: formik.values.image.name || 'image',
                                status: 'done',
                                originFileObj: formik.values.image,
                            }] : []}
                            onChange={(info) => {
                                console.log("Upload onChange:", info);
                                const file = info?.fileList?.[0]?.originFileObj;
                                if (file) {
                                    console.log("originFileObj FOUND:", file.name, file.size, "bytes");
                                    console.log("Setting Formik image to File object");
                                    formik.setFieldValue("image", file);
                                } else {
                                    console.log("originFileObj MISSING or fileList empty");
                                    console.log("Clearing Formik image");
                                    formik.setFieldValue("image", null);
                                }
                            }}
                        >
                            <Button icon={<PrefixIcon><i className="fi fi-rr-inbox-out"></i></PrefixIcon>}>
                                Click to Upload
                            </Button>
                        </Upload>
                    </Col>

                    {/* Manufacturer */}
                    <Col span={12}>
                        <Row><label>Manufacturer</label></Row>
                        <Input
                            name="manufacturer"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.manufacturer}
                            placeholder="Enter manufacturer"
                        />
                        {formik.touched.manufacturer && formik.errors.manufacturer ? (
                            <small className="text-danger">{formik.errors.manufacturer}</small>
                        ) : null}
                    </Col>

                    {/* Product Name */}
                    <Col span={12}>
                        <label>Product's name</label>
                        <Input
                            name="name"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                            placeholder="Enter product name"
                        />
                        {formik.touched.name && formik.errors.name ? (
                            <small className="text-danger">{formik.errors.name}</small>
                        ) : null}
                    </Col>

                    {/* Description */}
                    <Col span={24}>
                        <label>Description</label>
                        <Input.TextArea
                            rows={10}
                            name="description"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.description}
                            placeholder="Enter product description"
                        />
                        {formik.touched.description && formik.errors.description ? (
                            <Error className="text-danger">{formik.errors.description}</Error>
                        ) : null}
                    </Col>

                    {/* Category TreeSelect */}
                    <Col span={24}>
                        <Row><label>Category <span style={{ color: 'red' }}>*</span></label></Row>
                        <TreeSelect
                            name="category"
                            placeholder="Select a category (parent or child)"
                            treeData={categoryTree}
                            value={formik.values.category}
                            onChange={(value) => {
                                formik.setFieldValue("category", value);
                                formik.setFieldTouched("category", true);
                            }}
                            onBlur={formik.handleBlur}
                            loading={loading}
                            style={{ width: "100%" }}
                            showSearch
                            treeDefaultExpandAll={false}
                            allowClear
                            treeNodeFilterProp="title"
                            // Allow selecting both parent and child nodes
                            treeCheckable={false}
                            // Display format
                            treeLine={{ showLeafIcon: false }}
                            // Search functionality
                            filterTreeNode={(inputValue, treeNode) => {
                                return treeNode.title.toLowerCase().includes(inputValue.toLowerCase());
                            }}
                        />
                        {formik.touched.category && formik.errors.category ? (
                            <Error className="text-danger">{formik.errors.category}</Error>
                        ) : null}
                        {defaultCategory && (
                            <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
                                Default: {defaultCategory.name} (you can change this)
                            </small>
                        )}
                    </Col>

                    {/* Submit Button */}
                    <Col span={24}>
                        <Row justify="end">
                            <Space>
                                <Button
                                    type="primary"
                                    className="mt-3"
                                    htmlType="submit"
                                    loading={loading}
                                >
                                    Save
                                </Button>
                            </Space>
                        </Row>
                    </Col>
                </Row>
            </form>
        </div>
    );
}
