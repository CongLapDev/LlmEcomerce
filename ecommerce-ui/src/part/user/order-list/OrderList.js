import { Row, Col, Spin } from 'antd';
import { useState, useEffect, useRef, useCallback } from 'react';
import APIBase from '../../../api/ApiBase';
import UserOrder from '../user-order/UserOrder';
function OrderList({ state, user }) {
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(true);
    const loadingRef = useRef(false);
    const pageRef = useRef({ index: 0, isEnd: false, loaded: false });
    const requestTokenRef = useRef(0);

    const fetchOrder = useCallback((targetPage, reset = false) => {
        if (!state) return;
        if (loadingRef.current) return;
        if (!reset && pageRef.current.isEnd) return;

        loadingRef.current = true;
        setLoad(true);
        const requestToken = requestTokenRef.current;

        APIBase.get(`/api/v1/order?status=${state}&page=${targetPage}`)
            .then(payload => {
                if (requestToken !== requestTokenRef.current) return;

                const incoming = payload?.data?.content || [];
                const totalPages = payload?.data?.totalPages || 0;

                setData(prev => {
                    const merged = reset ? incoming : [...prev, ...incoming];
                    const uniqueById = new Map();
                    merged.forEach(order => {
                        if (order?.id != null) uniqueById.set(order.id, order);
                    });
                    return Array.from(uniqueById.values());
                });

                const isEnd = totalPages === 0 || targetPage >= totalPages - 1;
                const nextPage = isEnd ? targetPage : targetPage + 1;
                const next = { index: nextPage, isEnd, loaded: false };
                pageRef.current = next;
                setPage(next);
            })
            .catch(console.log)
            .finally(() => {
                if (requestToken === requestTokenRef.current) {
                    loadingRef.current = false;
                    setLoad(false);
                }
            });
    }, [state]);

    const scrollToLoad = useCallback(() => {
        if (loadingRef.current || pageRef.current.isEnd) return;

        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        if (scrollTop + windowHeight >= docHeight - 120) {
            fetchOrder(pageRef.current.index);
        }
    }, [fetchOrder]);

    useEffect(() => {
        if (!state) return;

        requestTokenRef.current += 1;
        loadingRef.current = false;
        const resetPage = { index: 0, isEnd: false, loaded: false };
        pageRef.current = resetPage;
        setPage(resetPage);
        setData([]);
        setLoad(true);
        window.scrollTo({ top: 0, behavior: 'auto' });
        fetchOrder(0, true);

        window.addEventListener('scroll', scrollToLoad, { passive: true });
        return () => {
            window.removeEventListener('scroll', scrollToLoad);
        };
    }, [state, fetchOrder, scrollToLoad]);

    return (<Row justify="center">
        <Col span={24} lg={{ span: 16 }} >
            {data.map((item) => <UserOrder key={item.id} data={item} />)}
        </Col>
        {load && <Col span={24}>
            <Row justify="center" style={{ padding: "10px" }}><Spin /></Row>
        </Col>}
    </Row>);
}

export default OrderList;