import { 
    Card, Row, Col, Space, Statistic, Timeline, Divider, 
    Tag, Button, Modal, Form, Input, Avatar, Alert, Steps
} from "antd";
import { 
    CheckCircleOutlined, CloseCircleOutlined, 
    ExclamationCircleOutlined, SyncOutlined 
} from '@ant-design/icons';
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import APIBase, { getImageUrl } from "../../../api/ApiBase";
import { GlobalContext } from "../../../context";
import PlaceHolder from "../../../assets/image/product_placeholder.png";
import { Currency, Description } from "../../../components";
import OrderStatusTag from "../../../part/admin/order-status-tag/OrderStatusTag";
import { formatDateTime } from "../../../utils/dateFormatter";
import AdminLayout from "../../../components/layout/AdminLayout";
import PageHeader from "../../../components/ui/PageHeader";
import CardContainer from "../../../components/ui/CardContainer";
import { 
    getCurrentStatus, 
    getStatusLabel, 
    canCancelOrder, 
    isFinalStatus 
} from "../../../utils/orderUtils";
import { 
    validateTrackingNumber, 
    getTrackingUrl, 
    getTrackingFormatHint 
} from "../../../utils/validationUtils";

const { confirm } = Modal;
const { TextArea } = Input;

function AdminOrderDetailPage() {
    const [params] = useSearchParams();
    const [data, setData] = useState();
    const [actionLoading, setActionLoading] = useState(false);
    const globalContext = useContext(GlobalContext);
    const [cancelModal, setCancelModal] = useState(false);

    useEffect(() => {
        loadOrder();
    }, []);

    const loadOrder = () => {
        APIBase.get(`/api/v1/order/${params.get("id")}`)
            .then(payload => payload.data)
            .then(data => {
                setData(data);
                console.log('Order loaded:', data);
                console.log('Order date raw:', data.orderDate, 'Type:', typeof data.orderDate);
            })
            .catch(() => {
                globalContext.message.error("Unable to load order information");
            });
    };

    // ========== ACTION HANDLERS ==========

    const handleConfirmOrder = () => {
        confirm({
            title: 'Confirm Order',
            icon: <CheckCircleOutlined />,
            content: 'Are you sure you want to confirm this order?',
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk: async () => {
                setActionLoading(true);
                try {
                    const response = await APIBase.post(
                        `/api/v1/order/${params.get("id")}/status/confirm`,
                        { note: 'Order confirmed by admin' }
                    );
                    globalContext.message.success('✅ Order confirmed!');
                    loadOrder(); // Reload order
                } catch (error) {
                    globalContext.message.error('Confirmation error: ' + error.message);
                } finally {
                    setActionLoading(false);
                }
            }
        });
    };

    const handlePrepareOrder = () => {
        let note = '';
        confirm({
            title: 'Start Preparing Order',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>Notify warehouse to start preparing products.</p>
                    <TextArea
                        placeholder="Note (optional)"
                        rows={3}
                        onChange={(e) => note = e.target.value}
                    />
                </div>
            ),
            okText: 'Start Preparing',
            cancelText: 'Cancel',
            onOk: async () => {
                setActionLoading(true);
                try {
                    await APIBase.post(
                        `/api/v1/order/${params.get("id")}/status/prepare`,
                        { note: note || 'Warehouse is preparing order' }
                    );
                    globalContext.message.success('📦 Order moved to preparing!');
                    loadOrder();
                } catch (error) {
                    globalContext.message.error('Error: ' + error.message);
                } finally {
                    setActionLoading(false);
                }
            }
        });
    };

    const handleShipOrder = () => {
        let trackingNumber = '';
        let note = '';
        let validationResult = null;
        
        confirm({
            title: 'Ship Order',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>Enter tracking number:</p>
                    <Input
                        placeholder="Tracking number"
                        style={{ marginBottom: 10 }}
                        onChange={(e) => {
                            trackingNumber = e.target.value;
                            validationResult = validateTrackingNumber(trackingNumber);
                        }}
                    />
                    <Alert
                        message="Tracking Number Format"
                        description={getTrackingFormatHint()}
                        type="info"
                        showIcon
                        style={{ marginBottom: 10, fontSize: 12 }}
                    />
                    <TextArea
                        placeholder="Note (optional)"
                        rows={2}
                        onChange={(e) => note = e.target.value}
                    />
                </div>
            ),
            okText: 'Ship Order',
            cancelText: 'Cancel',
            onOk: async () => {
                // Validate tracking number
                const validation = validateTrackingNumber(trackingNumber);
                
                if (!validation.valid) {
                    globalContext.message.error(validation.message);
                    return Promise.reject();
                }
                
                if (validation.warning) {
                    globalContext.message.warning(validation.warning);
                }
                
                setActionLoading(true);
                try {
                    await APIBase.post(
                        `/api/v1/order/${params.get("id")}/status/ship`,
                        {
                            note: note || `Order shipped via ${validation.carrier || 'carrier'}`,
                            trackingNumber: trackingNumber
                        }
                    );
                    globalContext.message.success(`🚚 Shipped via ${validation.carrier || 'carrier'}!`);
                    loadOrder();
                } catch (error) {
                    globalContext.message.error('Error: ' + error.message);
                } finally {
                    setActionLoading(false);
                }
            }
        });
    };

    const handleDeliverOrder = () => {
        confirm({
            title: 'Confirm Delivery',
            icon: <CheckCircleOutlined />,
            content: (
                <div>
                    <p>Confirm that the order has been delivered successfully and COD payment collected?</p>
                    <p style={{ color: '#52c41a', fontWeight: 'bold' }}>
                        COD Amount: {data?.total?.toLocaleString()}₫
                    </p>
                </div>
            ),
            okText: 'Delivered',
            cancelText: 'Not Yet',
            onOk: async () => {
                setActionLoading(true);
                try {
                    await APIBase.post(
                        `/api/v1/order/${params.get("id")}/status/deliver`,
                        { note: `Delivery successful. COD payment of ${data.total.toLocaleString()}₫ collected` }
                    );
                    globalContext.message.success('✅ Order delivered successfully!');
                    loadOrder();
                } catch (error) {
                    globalContext.message.error('Error: ' + error.message);
                } finally {
                    setActionLoading(false);
                }
            }
        });
    };

    const handleCompleteOrder = () => {
        confirm({
            title: 'Complete Order',
            icon: <CheckCircleOutlined />,
            content: 'Confirm to complete this order? This action cannot be undone.',
            okText: 'Complete',
            okType: 'primary',
            cancelText: 'Cancel',
            onOk: async () => {
                setActionLoading(true);
                try {
                    await APIBase.post(
                        `/api/v1/order/${params.get("id")}/status/complete`,
                        { note: 'Order completed' }
                    );
                    globalContext.message.success('🎉 Order completed!');
                    loadOrder();
                } catch (error) {
                    globalContext.message.error('Error: ' + error.message);
                } finally {
                    setActionLoading(false);
                }
            }
        });
    };

    const handleCancelOrder = (formData) => {
        setActionLoading(true);
        APIBase.post(`/api/v1/order/${params.get("id")}/cancel`, formData)
            .then(() => {
                globalContext.message.success('Order cancelled');
                setCancelModal(false);
                loadOrder();
            })
            .catch(() => {
                globalContext.message.error('Error cancelling order');
            })
            .finally(() => {
                setActionLoading(false);
            });
    };

    // ========== GET ACTION BUTTONS BY STATUS ==========

    const getActionButtons = () => {
        if (!data) return null;

        const currentStatus = getCurrentStatus(data);
        if (!currentStatus) return null;

        const statusId = currentStatus.status;

        // Final states - show message only
        if (isFinalStatus(statusId)) {
            return (
                <Alert
                    message={statusId === 7 ? '🎉 Order Completed' : '❌ Order Cancelled'}
                    description={
                        statusId === 7
                            ? 'No further action needed. Order has been processed successfully.'
                            : `Reason: ${currentStatus.note}`
                    }
                    type={statusId === 7 ? 'success' : 'error'}
                    showIcon
                    style={{ marginTop: 16 }}
                />
            );
        }

        // Active states - show action buttons
        return (
            <div style={{ marginTop: 16 }}>
                <Alert
                    message="💡 Next Step"
                    description={getNextStepHint(statusId)}
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                />

                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    {/* Primary Action Button */}
                    {statusId === 1 && ( // PENDING_PAYMENT
                        <Button
                            type="primary"
                            size="large"
                            icon={<CheckCircleOutlined />}
                            onClick={handleConfirmOrder}
                            loading={actionLoading}
                            block
                        >
                            ✅ Confirm Order
                        </Button>
                    )}

                    {statusId === 3 && ( // CONFIRMED
                        <Button
                            type="primary"
                            size="large"
                            icon={<SyncOutlined />}
                            onClick={handlePrepareOrder}
                            loading={actionLoading}
                            block
                        >
                            📦 Start Preparing
                        </Button>
                    )}

                    {statusId === 4 && ( // PREPARING
                        <Button
                            type="primary"
                            size="large"
                            icon={<SyncOutlined />}
                            onClick={handleShipOrder}
                            loading={actionLoading}
                            block
                        >
                            🚚 Ship Order
                        </Button>
                    )}

                    {statusId === 5 && ( // SHIPPING
                        <Button
                            type="primary"
                            size="large"
                            icon={<CheckCircleOutlined />}
                            onClick={handleDeliverOrder}
                            loading={actionLoading}
                            block
                        >
                            ✅ Confirm Delivery
                        </Button>
                    )}

                    {statusId === 6 && ( // DELIVERED
                        <Button
                            type="primary"
                            size="large"
                            icon={<CheckCircleOutlined />}
                            onClick={handleCompleteOrder}
                            loading={actionLoading}
                            block
                        >
                            🎉 Complete Order
                        </Button>
                    )}

                    {/* Cancel Button (if allowed) */}
                    {canCancelOrder(statusId) && (
                        <Button
                            danger
                            size="large"
                            icon={<CloseCircleOutlined />}
                            onClick={() => setCancelModal(true)}
                            loading={actionLoading}
                            block
                        >
                            ❌ Cancel Order
                        </Button>
                    )}
                </Space>
            </div>
        );
    };

    const getNextStepHint = (statusId) => {
        const hints = {
            1: 'Review order information and confirm',
            3: 'Notify warehouse to start preparing products',
            4: 'After packaging, ship order and enter tracking number',
            5: 'Wait for carrier to deliver and collect COD payment',
            6: 'Confirm order completion (or auto-complete after 3 days)'
        };
        return hints[statusId] || 'Process order';
    };

    // ========== RENDER ORDER TIMELINE ==========

    const renderTimeline = () => {
        if (!data) return null;

        const currentStatus = getCurrentStatus(data);
        if (!currentStatus) return null;

        const currentStatusId = currentStatus.status;

        // For CANCELLED orders
        if (currentStatusId === 8) {
            return (
                <Card style={{ marginBottom: 16 }}>
                    <Steps
                        current={0}
                        status="error"
                        items={[
                            {
                                title: 'Order Cancelled',
                                icon: <CloseCircleOutlined />,
                                description: currentStatus.note
                            }
                        ]}
                    />
                </Card>
            );
        }

        // Normal workflow steps
        const workflowSteps = [
            { id: 1, title: 'To Pay' },
            { id: 3, title: 'Confirmed' },
            { id: 4, title: 'Preparing' },
            { id: 5, title: 'Shipping' },
            { id: 6, title: 'Delivered' },
            { id: 7, title: 'Completed' }
        ];

        let currentStep = 0;
        workflowSteps.forEach((step, index) => {
            if (currentStatusId >= step.id) {
                currentStep = index;
            }
        });

        return (
            <CardContainer className="mb-6">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                    <h3 className="font-heading font-semibold text-slate-700 text-sm">Order Progress</h3>
                </div>
                <div className="p-6 overflow-x-auto">
                <Steps
                    current={currentStep}
                    status={currentStatusId === 7 ? 'finish' : 'process'}
                    items={workflowSteps.map((step, index) => ({
                        title: step.title,
                        description: index === currentStep ? '← Current step' : null
                    }))}
                        className="min-w-[600px]"
                />
                </div>
            </CardContainer>
        );
    };

    // ========== RENDER ==========

    if (!data) {
        return <div style={{ padding: 24, textAlign: 'center' }}>Loading...</div>;
    }

    const currentStatus = getCurrentStatus(data);

    return (
        <AdminLayout>
            {/* Cancel Order Modal */}
            <Modal
                title="Cancel Order"
                open={cancelModal}
                onCancel={() => setCancelModal(false)}
                footer={null}
            >
                <Alert
                    message="Warning"
                    description="This action cannot be undone!"
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
                <Form onFinish={handleCancelOrder}>
                    <Form.Item
                        name="note"
                        rules={[{ required: true, message: 'Please enter cancellation reason' }]}
                    >
                        <TextArea placeholder="Cancellation reason (required)" rows={3} />
                    </Form.Item>
                    <Form.Item name="detail">
                        <TextArea placeholder="Details (optional)" rows={2} />
                    </Form.Item>
                    <Row justify="end">
                        <Space>
                            <Button onClick={() => setCancelModal(false)}>Cancel</Button>
                            <Button type="primary" danger htmlType="submit" loading={actionLoading}>
                                Confirm Cancellation
                            </Button>
                        </Space>
                    </Row>
                </Form>
            </Modal>

            {/* Main Content */}
            <PageHeader
                title={`Order #${data.id}`}
                subtitle="View and manage order details"
                actions={<OrderStatusTag status={currentStatus?.status} />}
            />

            <div className="flex flex-col gap-6">
                
                {/* Timeline - Full Width */}
                <div className="w-full">
                    {renderTimeline()}
                </div>
                
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Customer Info */}
                    <div className="w-full lg:w-1/4 flex flex-col gap-6">
                        <CardContainer>
                            <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                                <h3 className="font-heading font-semibold text-slate-700 text-sm">👤 Customer</h3>
                            </div>
                            <div className="p-5">
                                <Card.Meta
                                    avatar={<Avatar src={data.user.picture} />}
                                    title={`${data.user.firstname} ${data.user.lastname}`}
                                    description={data.user.email}
                                />
                                {data.user.phoneNumber && (
                                    <p style={{ marginTop: 12 }}>
                                        <strong>Phone:</strong> {data.user.phoneNumber}
                                    </p>
                                )}
                            </div>
                        </CardContainer>
                        
                        <CardContainer>
                            <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                                <h3 className="font-heading font-semibold text-slate-700 text-sm">📍 Delivery Address</h3>
                            </div>
                            <div className="p-5">
                                <p>{data.address.city}</p>
                                <Description>{data.address.region}</Description>
                                <Description>{data.address.addressLine1}</Description>
                            </div>
                        </CardContainer>
                    </div>

                    {/* Order Details & Sidebar */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col xl:flex-row gap-6">
                            
                            {/* Main Left Column (Stats & Products) */}
                            <div className="flex-1 min-w-0 flex flex-col gap-6">
                                
                                {/* Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <CardContainer>
                                        <div className="p-5">
                                            <Statistic title="📅 Order Date" value={formatDateTime(data.orderDate)} />
                                        </div>
                                    </CardContainer>
                                    <CardContainer>
                                        <div className="p-5">
                                            <Statistic title="💰 Total" value={data.total} suffix="₫" />
                                        </div>
                                    </CardContainer>
                                    <CardContainer>
                                        <div className="p-5">
                                            <Statistic
                                                title="🚚 Shipping"
                                                value={data.shippingMethod?.price || 0}
                                                suffix="₫"
                                            />
                                        </div>
                                    </CardContainer>
                                </div>

                                {/* Products */}
                                <CardContainer>
                                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                                        <h3 className="font-heading font-semibold text-slate-700 text-sm">📦 Products</h3>
                                    </div>
                                    <div className="p-5">
                                        {data.orderLines.map((item, index) => (
                                            <div key={index}>
                                                <div className="flex items-center gap-4 py-4">
                                                    <div className="w-16 h-16 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                                        <img
                                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                            src={getImageUrl(item.productItem.product.picture) || PlaceHolder}
                                                            alt={item.productItem.product.name}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-semibold text-slate-800 truncate mb-1">{item.productItem.product.name}</h4>
                                                        <div className="flex gap-2 items-center mb-2">
                                                            <Tag color="blue" className="rounded-md border-transparent mx-0">
                                                                {item.productItem.options.map(opt => opt.value).join(", ")}
                                                            </Tag>
                                                        </div>
                                                        <div className="flex justify-between items-center mt-2">
                                                            <span className="text-xs text-slate-500 font-medium">Quantity: {item.qty}</span>
                                                            <strong className="text-brand-600 font-heading"><Currency value={item.total} /></strong>
                                                        </div>
                                                    </div>
                                                </div>
                                                {index < data.orderLines.length - 1 && <Divider className="my-2 border-slate-100" />}
                                            </div>
                                        ))}
                                        <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end">
                                            <h3 className="text-base font-bold text-slate-800">Total: <span style={{ color: '#52c41a' }} className="font-heading ml-2 text-lg">
                                                <Currency value={data.total} />
                                            </span></h3>
                                        </div>
                                    </div>
                                </CardContainer>
                            </div>

                            {/* Right Sidebar */}
                            <div className="w-full xl:w-80 flex-shrink-0 flex flex-col gap-6">
                                
                                {/* Payment Method */}
                                <CardContainer>
                                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                                        <h3 className="font-heading font-semibold text-slate-700 text-sm">💳 Payment</h3>
                                    </div>
                                    <div className="p-5">
                                        <p className="text-xs text-slate-500 font-medium mb-2">Method:</p>
                                        <Tag color="gold" className="rounded-md mx-0">{data.payment?.type.name}</Tag>
                                    </div>
                                </CardContainer>

                                {/* Tracking Number (if shipping) */}
                                {(() => {
                                    const shippingStatus = data.status.find(s => s.status === 5); // SHIPPING
                                    if (shippingStatus && shippingStatus.detail) {
                                        const validation = validateTrackingNumber(shippingStatus.detail);
                                        const trackingUrl = getTrackingUrl(shippingStatus.detail, validation.carrier);
                                        
                                        return (
                                            <CardContainer>
                                                <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                                                    <h3 className="font-heading font-semibold text-slate-700 text-sm">🚚 Shipping</h3>
                                                </div>
                                                <div className="p-5">
                                                    <p className="text-xs text-slate-500 font-medium mb-2">Tracking Number:</p>
                                                    <Tag color="purple" className="rounded-md mx-0 text-sm py-0.5">{shippingStatus.detail}</Tag>
                                                    {validation.carrier && (
                                                        <div className="mt-2">
                                                            <Tag color="blue" className="rounded-md mx-0">{validation.carrier}</Tag>
                                                        </div>
                                                    )}
                                                    {trackingUrl && (
                                                        <div className="mt-4">
                                                            <Button
                                                                type="link"
                                                                href={trackingUrl}
                                                                target="_blank"
                                                                className="px-0 flex items-center gap-2 text-brand-600 hover:text-brand-700"
                                                            >
                                                                <i className="fi fi-rr-search"></i> Track Package
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContainer>
                                        );
                                    }
                                    return null;
                                })()}

                                {/* Action Buttons */}
                                <CardContainer>
                                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                                        <h3 className="font-heading font-semibold text-slate-700 text-sm">⚡ Actions</h3>
                                    </div>
                                    <div className="p-5">
                                        {getActionButtons()}
                                    </div>
                                </CardContainer>

                                {/* Status History */}
                                <CardContainer>
                                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                                        <h3 className="font-heading font-semibold text-slate-700 text-sm">📜 History</h3>
                                    </div>
                                    <div className="p-5">
                                        <Timeline
                                            items={data.status.map(item => ({
                                                children: (
                                                    <div className="mb-2">
                                                        <OrderStatusTag status={item.status} />
                                                        <h4 className="mt-2 font-medium text-slate-800 text-sm">{item.note}</h4>
                                                        {item.detail && (
                                                            <p className="text-xs text-slate-500 mt-1">{item.detail}</p>
                                                        )}
                                                        <p className="text-[10px] text-slate-400 mt-1">{formatDateTime(item.updateAt)}</p>
                                                    </div>
                                                )
                                            })).reverse()}
                                            className="mt-2"
                                        />
                                    </div>
                                </CardContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminOrderDetailPage;
