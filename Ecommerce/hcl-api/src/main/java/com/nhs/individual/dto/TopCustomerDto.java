package com.nhs.individual.dto;

import java.io.Serializable;
import java.math.BigDecimal;

public class TopCustomerDto implements Serializable {
    private final Integer userId;
    private final String name;
    private final BigDecimal totalSpend;
    private final Long orderCount;

    public TopCustomerDto(Integer userId, String name, BigDecimal totalSpend, Long orderCount) {
        this.userId = userId;
        this.name = name;
        this.totalSpend = totalSpend;
        this.orderCount = orderCount;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getTotalSpend() {
        return totalSpend;
    }

    public Long getOrderCount() {
        return orderCount;
    }
}