package com.nhs.individual.dto;

import java.io.Serializable;
import java.math.BigDecimal;

public class RecentOrderRowDto implements Serializable {
    private final Integer orderId;
    private final String customerName;
    private final String productName;
    private final BigDecimal amount;
    private final String amountFormatted;
    private final String status;
    private final String date;

    public RecentOrderRowDto(
            Integer orderId,
            String customerName,
            String productName,
            BigDecimal amount,
            String amountFormatted,
            String status,
            String date
    ) {
        this.orderId = orderId;
        this.customerName = customerName;
        this.productName = productName;
        this.amount = amount;
        this.amountFormatted = amountFormatted;
        this.status = status;
        this.date = date;
    }

    public Integer getOrderId() {
        return orderId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getProductName() {
        return productName;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getAmountFormatted() {
        return amountFormatted;
    }

    public String getStatus() {
        return status;
    }

    public String getDate() {
        return date;
    }
}