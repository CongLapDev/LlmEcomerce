package com.nhs.individual.dto;

import java.io.Serializable;

public class TopProductDto implements Serializable {
    private final Integer productId;
    private final String productName;
    private final Long salesVolume;

    public TopProductDto(Integer productId, String productName, Long salesVolume) {
        this.productId = productId;
        this.productName = productName;
        this.salesVolume = salesVolume;
    }

    public Integer getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public Long getSalesVolume() {
        return salesVolume;
    }
}