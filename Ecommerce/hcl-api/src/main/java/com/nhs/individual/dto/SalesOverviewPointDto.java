package com.nhs.individual.dto;

import java.io.Serializable;
import java.math.BigDecimal;

public class SalesOverviewPointDto implements Serializable {
    private final String date;
    private final BigDecimal revenue;

    public SalesOverviewPointDto(String date, BigDecimal revenue) {
        this.date = date;
        this.revenue = revenue;
    }

    public String getDate() {
        return date;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }
}