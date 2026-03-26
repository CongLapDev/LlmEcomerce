import React from 'react';
import { Tag } from 'antd';
import { ShoppingOutlined, StopOutlined } from '@ant-design/icons';

function StockBadge({ stockInfo }) {
    if (!stockInfo) {
        // No stock info loaded yet, or API call failed - degrade gracefully
        return null;
    }

    if (stockInfo.availableQty === 0) {
        return (
            <Tag color="error" icon={<StopOutlined />}>
                Out of Stock
            </Tag>
        );
    }

    if (!stockInfo.isAvailable) {
        return (
            <Tag color="warning" icon={<ShoppingOutlined />}>
                Only {stockInfo.availableQty} left
            </Tag>
        );
    }

    // Fully available
    return null;
}

export default StockBadge;
