import React from 'react';
import { Table } from 'antd';
import './DataTable.css'; // We will include a CSS file to override Ant Design styles to look modern

function DataTable({ columns, dataSource, rowKey = "id", loading = false, pagination, expandable, rowSelection, onRow }) {
    return (
        <div className="modern-data-table-wrapper w-full overflow-x-auto">
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey={rowKey}
                loading={loading}
                pagination={pagination}
                expandable={expandable}
                rowSelection={rowSelection}
                onRow={onRow}
                // Always remove Antd builtin borders to apply our Tailwind-like custom borders
                bordered={false}
                size="middle"
            />
        </div>
    );
}

export default DataTable;
