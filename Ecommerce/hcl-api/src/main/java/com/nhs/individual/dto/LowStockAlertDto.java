package com.nhs.individual.dto;

import java.io.Serializable;

public class LowStockAlertDto implements Serializable {
    private final String productName;
    private final Integer currentStock;

    public LowStockAlertDto(String productName, Integer currentStock) {
        this.productName = productName;
        this.currentStock = currentStock;
    }

    public String getProductName() {
        return productName;
    }

    public Integer getCurrentStock() {
        return currentStock;
    }
}
