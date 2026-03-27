package com.nhs.individual.dto;

import java.io.Serializable;

public class StockLevelDto implements Serializable {
    private final Integer productItemId;
    private final String productName;
    private final Integer warehouseId;
    private final String warehouseName;
    private final String sku;
    private final Integer quantity;

    public StockLevelDto(Integer productItemId, String productName, Integer warehouseId, String warehouseName, String sku, Integer quantity) {
        this.productItemId = productItemId;
        this.productName = productName;
        this.warehouseId = warehouseId;
        this.warehouseName = warehouseName;
        this.sku = sku;
        this.quantity = quantity;
    }

    public Integer getProductItemId() {
        return productItemId;
    }

    public String getProductName() {
        return productName;
    }

    public Integer getWarehouseId() {
        return warehouseId;
    }

    public String getWarehouseName() {
        return warehouseName;
    }

    public String getSku() {
        return sku;
    }

    public Integer getQuantity() {
        return quantity;
    }
}
