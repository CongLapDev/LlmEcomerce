import React, { useContext, useEffect, useState } from "react";
import { Upload, Space, Button } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import APIBase from "../../../api/ApiBase";
import { GlobalContext } from "../../../context";
import PrefixIcon from "../../../components/prefix-icon/PrefixIcon";
import { default as LinkStyle } from "antd/es/typography/Link";
import AdminLayout from "../../../components/layout/AdminLayout";
import PageHeader from "../../../components/ui/PageHeader";
import CardContainer from "../../../components/ui/CardContainer";
import style from './style.module.scss';
function AdminWareHouseDetailPage() {
    const [params, setParams] = useSearchParams();
    const [data, setData] = useState(undefined);
    const globalContext = useContext(GlobalContext);
    const [uploading, setUploading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [productList, setProductList] = useState(undefined)
    
    function loadWarehouseData() {
        APIBase.get(`/api/v1/warehouse/${params.get("id")}`).then(payload => payload.data)
            .then(data => {
                setData(data)
                return data;
            })
            .then(data => {
                let products = data.warehouseItems.reduce((pre, currentItem) => {
                    let product = undefined;
                    for (let i = 0; i < pre.length; i++) {
                        if (pre[i].id == currentItem.productItem.productId) {
                            product = pre[i];
                            break;
                        }
                    }
                    if (product) {
                        product.productItems = Array.isArray(product.productItems) ? [currentItem, ...product.productItems] : []
                    } else {
                        pre.push(({
                            ...currentItem.productItem.product,
                            productItems: [currentItem]
                        }))
                    }
                    return pre;
                }, [])
                setProductList(products);
            })
            .catch(() => {
                globalContext.message.error("Error");
            })
    }
    
    useEffect(() => {
        loadWarehouseData();
    }, [params])
    
    function handleUploadFile() {
        setUploading(true);
        var formData = new FormData();
        formData.append("file", fileList[0])
        APIBase.post(`/api/v1/warehouse/${params.get("id")}/importXLSX`, formData)
            .then(payload => payload.data)
            .then(data => {
                globalContext.message.success("Import successfully");
                setFileList([]); // Clear file list after successful upload
                loadWarehouseData(); // Reload warehouse data to update UI
            })
            .catch(e => {
                globalContext.message.error("Reading file error");
            }).finally(() => {
                setUploading(false);
            })
    }

    function handleDownloadSample() {
        APIBase.get('/api/v1/warehouse/template', {
            responseType: 'blob' // Important: Get binary data
        })
            .then(response => {
                // Create a blob from the response data
                const blob = new Blob([response.data], { 
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                });
                
                // Create a temporary URL for the blob
                const url = window.URL.createObjectURL(blob);
                
                // Create a temporary anchor element and trigger download
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'warehouse_sku_template.xlsx');
                document.body.appendChild(link);
                link.click();
                
                // Clean up: remove the link and revoke the blob URL
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);
                
                globalContext.message.success("Template file downloaded successfully");
            })
            .catch(e => {
                console.error("Download error:", e);
                globalContext.message.error("Failed to download sample file");
            })
    }
    return (
        <AdminLayout>
            <PageHeader 
                title={data?.name || "Warehouse Detail"} 
                subtitle="Manage warehouse inventory and import data" 
            />
            {data && (
                <CardContainer>
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <Space>
                            <Upload beforeUpload={file => {
                                setFileList([file]);
                                return false;
                            }} fileList={fileList} showUploadList={false}>
                                <Button icon={<PrefixIcon><i className="fi fi-rr-file-upload"></i></PrefixIcon>} className="rounded-xl border-slate-200">Select file</Button>
                            </Upload>
                            {fileList.length > 0 && <span className="text-xs text-slate-500 font-medium">{fileList[0].name}</span>}
                            <Button loading={uploading} onClick={handleUploadFile} className="bg-brand-600 text-white rounded-xl hover:bg-brand-700 border-transparent" disabled={fileList.length === 0}>Import</Button>
                            <Button onClick={handleDownloadSample} className="rounded-xl border-slate-200">Download Sample</Button>
                        </Space>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 text-slate-500 font-heading text-[10px] uppercase tracking-wider border-b border-slate-200">
                            <tr>
                                <td>PRODUCT_ID</td>
                                <td>PRODUCT</td>
                                <td>MANUFACTURER</td>
                                <td>PRODUCT_ITEM_ID</td>
                                <td>SPEC</td>
                                <td>ORIGINAL PRICE</td>
                                <td>PRICE</td>
                                <td>QUANTITY</td>
                            </tr>
                        </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 font-body">
                            {productList && productList.map((item_, index) =>
                                <React.Fragment key={item_.id}>
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3 font-mono font-medium text-brand-600" rowSpan={item_.productItems.length}> <Link to={`/admin/product?id=${item_.id}`}>{item_.id}</Link> </td>
                                        <td className="px-4 py-3 font-semibold text-slate-800" rowSpan={item_.productItems.length}><Link to={`/admin/product?id=${item_.id}`}>{item_.name} </Link></td>
                                        <td className="px-4 py-3 text-slate-500" rowSpan={item_.productItems.length}>{item_.manufacturer}</td>
                                        <td className="px-4 py-3 text-slate-500">{item_.productItems[0]?.productItem.id}</td>
                                        <td className="px-4 py-3 text-slate-500">{item_.productItems[0]?.productItem.options?.map(option_ => option_.value).join(",")}</td>
                                        <td className="px-4 py-3 text-slate-400 line-through">${item_.productItems[0]?.productItem.originalPrice?.toLocaleString()}</td>
                                        <td className="px-4 py-3 font-heading font-bold text-slate-800">${item_.productItems[0]?.productItem.price?.toLocaleString()}</td>
                                        <td className="px-4 py-3 font-medium text-slate-700">{item_.productItems[0]?.qty}</td>
                                    </tr>
                                    {item_.productItems.map((item, index) => {
                                        if (index === 0) return null;
                                        return (<tr key={item.productItem.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-3 text-slate-500">{item.productItem.id}</td>
                                            <td className="px-4 py-3 text-slate-500">{item.productItem.options?.map(option_ => option_.value).join(",")}</td>
                                            <td className="px-4 py-3 text-slate-400 line-through">${item.productItem.originalPrice?.toLocaleString()}</td>
                                            <td className="px-4 py-3 font-heading font-bold text-slate-800">${item.productItem.price?.toLocaleString()}</td>
                                            <td className="px-4 py-3 font-medium text-slate-700">{item.qty}</td>
                                        </tr>)
                                    })}
                                </React.Fragment>)}
                            </tbody>
                        </table>
                    </div>
                </CardContainer>
            )}
        </AdminLayout>
    );
}

export default AdminWareHouseDetailPage;