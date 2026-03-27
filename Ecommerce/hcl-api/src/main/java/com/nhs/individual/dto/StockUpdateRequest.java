package com.nhs.individual.dto;

import java.io.Serializable;

public class StockUpdateRequest implements Serializable {
    private Integer quantity;
    private String sku;

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }
}
