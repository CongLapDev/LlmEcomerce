package com.nhs.individual.dto;

import java.io.Serializable;
import java.math.BigDecimal;

public class CategoryRevenueDto implements Serializable {
    private final Integer categoryId;
    private final String categoryName;
    private final BigDecimal revenue;

    public CategoryRevenueDto(Integer categoryId, String categoryName, BigDecimal revenue) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.revenue = revenue;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }
}