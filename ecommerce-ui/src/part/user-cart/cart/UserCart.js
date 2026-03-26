import { useEffect, useRef, useState } from "react";
import OrderItem from "../../../components/order-item/OrderItem";
import { Row, Col, Button, Card, Empty, Space } from 'antd';
import style from './style.module.scss';
import APIBase from "../../../api/ApiBase";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../secure/useAuth";
import { Spin } from "antd";
import { Currency, StockBadge } from "../../../components";
import { ShoppingCartOutlined, ShopOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useStockValidation } from "../../../hooks/useStockValidation";
function UserCart() {
    const [state, user] = useAuth();
    const [page, setPage] = useState({
        index: 0,
        isEnd: false
    });
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [selectedItems, setSelectedItem] = useState([]);
    const [load, setLoad] = useState(false);
    
    // Custom hook for debounced & cached stock checking
    const { stockMap, hasOutOfStock } = useStockValidation(data);
    
    const loadingRef = useRef(false);
    const pageRef = useRef(page);

    useEffect(() => {
        pageRef.current = page;
    }, [page]);

    function scrollToLoad() {
        if (loadingRef.current || pageRef.current.isEnd || !user?.id) return;

        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        if (scrollTop + windowHeight >= docHeight - 100) {
            fetch(pageRef.current.index);
        }
    }

    useEffect(() => {
        if (user?.id) {
            setData([]);
            setPage({ index: 0, isEnd: false });
            setSelectedItem([]);
            pageRef.current = { index: 0, isEnd: false };
            fetch(0, true);
        }
        const onScroll = scrollToLoad;
        window.addEventListener("scroll", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
        }
    }, [user]);

    useEffect(() => {
        setSelectedItem(selected => selected.filter(selectedItem => data.some(item => item.id === selectedItem.id)));
    }, [data]);

    function fetch(targetPage, reset = false) {
        if (!user?.id) return;
        if (loadingRef.current) return;
        if (!reset && pageRef.current.isEnd) return;

        loadingRef.current = true;
        setLoad(true);

        APIBase.get(`api/v1/cart?userId=${user.id}&page=${targetPage}`)
                .then(payload => {
                    const incoming = payload?.data?.content || [];
                    const totalPages = payload?.data?.totalPages || 0;

                    setData(prev => {
                        const merged = reset ? incoming : [...prev, ...incoming];
                        const uniqueById = new Map();
                        merged.forEach(item => {
                            if (item?.id != null) uniqueById.set(item.id, item);
                        });
                        return Array.from(uniqueById.values());
                    });

                    const isEnd = totalPages === 0 || targetPage >= totalPages - 1;
                    const nextPage = isEnd ? targetPage : targetPage + 1;
                    const next = { index: nextPage, isEnd };
                    pageRef.current = next;
                    setPage(next);
                })
                .catch(console.error)
                .finally(() => {
                    loadingRef.current = false;
                    setLoad(false);
                });
    }

    function onCheckItem(e) {
        if (e.target.checked) {
            setSelectedItem(selectedItem_ => {
                var temp = data.find(item_ => item_.id === Number.parseInt(e.target.value));
                if (temp) return [...selectedItem_, temp];
                return selectedItem_;
            });
        } else {
            setSelectedItem(item_ => {
                for (var i = 0; i < item_.length; i++) {
                    if (item_[i].id === Number.parseInt(e.target.value)) {
                        item_.splice(i, 1);
                    }
                }
                return [...item_];
            })
        }
    }

    function handleItemChange(id, cartItem) {

        APIBase
            .put(`/api/v1/cart/${id}`, cartItem)
            .then(payload => {
                setData(item_ => {
                    for (var i = 0; i < item_.length; i++) {
                        if (item_[i].id === payload.data.id) {
                            item_[i] = payload.data;
                            return [...item_];
                        }
                    }
                    return [...item_];

                })
                setSelectedItem(item_ => {
                    for (var i = 0; i < item_.length; i++) {
                        if (item_[i].id === payload.data.id) {
                            item_[i] = payload.data;
                            return [...item_];
                        }
                    }
                    return [...item_];
                })
            })
            .catch(console.log)
    }
    function handleDelete(id) {
        setData(item_ => {
            for (var i = 0; i < item_.length; i++) {
                if (item_[i].id === Number.parseInt(id)) item_.splice(i, 1);
            }
            return [...item_];
        })
        APIBase.delete(`/api/v1/cart/${id}`).catch(console.log)
    }
    // Show empty state if cart is empty
    if (data.length === 0 && !load && page.index === 0) {
        return (
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card>
                        <Empty
                            image={<ShoppingCartOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
                            description={
                                <div>
                                    <p style={{ fontSize: 16, marginBottom: 8 }}>
                                        <strong>Your cart is empty</strong>
                                    </p>
                                    <p style={{ color: '#8c8c8c', marginBottom: 16 }}>
                                        Already placed an order? Track your order status in <strong>Order History</strong>
                                    </p>
                                    <Space size="middle">
                                        <Button 
                                            type="primary" 
                                            icon={<ShopOutlined />}
                                            onClick={() => {
                                                // Navigate to order history (first tab after Cart in UserCartPage)
                                                navigate("/cart", { 
                                                    state: { activeTab: 2 } // "To Pay" tab
                                                });
                                            }}
                                        >
                                            View my orders
                                        </Button>
                                        <Button 
                                            onClick={() => navigate("/")}
                                        >
                                            Continue shopping
                                        </Button>
                                    </Space>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
        );
    }

    return (<Row gutter={[12, 12]} className={style.cartLayout}>
        <Col span={24} md={{ span: 14 }} lg={{ span: 15 }}>
            <div title="Your Item">
                {data.map((item) => {
                    const stockInfo = stockMap[item.productItem.id];
                    const isInvalid = stockInfo && !stockInfo.isAvailable;
                    
                    return (
                    <Row 
                        className={style.cartRow} 
                        gutter={[8, 8]} 
                        key={item.id} 
                        align="middle"
                        style={isInvalid ? { border: '1px solid #ff4d4f', backgroundColor: '#fff2f0', borderRadius: '8px', padding: '4px' } : {}}
                    >
                        <Col xs={2} sm={2} md={2} lg={1}><input type='checkbox' checked={selectedItems.some(selectedItem_ => selectedItem_.id === item.id)} value={item.id} onChange={onCheckItem} /></Col>
                        <Col xs={20} sm={20} md={20} lg={22}>
                            <OrderItem onChange={(payload) => handleItemChange(item.id, payload)} data={item} />
                            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <StockBadge stockInfo={stockInfo} />
                                {isInvalid && <span style={{ color: '#ff4d4f', fontSize: '12px' }}><ExclamationCircleOutlined /> Please reduce quantity or remove item</span>}
                            </div>
                        </Col>
                        <Col xs={2} sm={2} md={2} lg={1} className={style.deleteBtn} onClick={() => handleDelete(item.id)}><i className="fi fi-br-cross-small"></i></Col>
                    </Row>
                )})}
            </div>
        </Col>
        {(load && !page.isEnd) && <Col span={24}>
            <Row justify="center"><Spin /></Row>
        </Col>}
        <Col span={24} md={{ span: 10 }} lg={{ span: 9 }}>
            <Card title="Summary" className={style.summaryCard}>
                <h4 className={style.summaryValue}><Currency value={selectedItems.reduce((pre, item) => {
                    const safeQty = Math.max(1, item.qty || 1);
                    return pre + safeQty * item.productItem.price;
                }, 0)} /></h4>
                <Button 
                    type="primary"
                    block
                    disabled={selectedItems.length === 0 || hasOutOfStock(selectedItems)}
                    onClick={() => {
                        navigate("/checkout", {
                            state: {
                                data: selectedItems
                            }
                        })
                    }}
                >
                    Checkout
                </Button>
            </Card>
        </Col>
    </Row>);
}

export default UserCart;