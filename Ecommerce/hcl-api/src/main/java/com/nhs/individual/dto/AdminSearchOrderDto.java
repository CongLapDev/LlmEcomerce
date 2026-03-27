package com.nhs.individual.dto;

import java.io.Serializable;
import java.math.BigDecimal;

public class AdminSearchOrderDto implements Serializable {
    private final Integer id;
    private final String customerName;
    private final BigDecimal amount;
    private final String amountFormatted;
    private final String date;

    public AdminSearchOrderDto(
            Integer id,
            String customerName,
            BigDecimal amount,
            String amountFormatted,
            String date
    ) {
        this.id = id;
        this.customerName = customerName;
        this.amount = amount;
        this.amountFormatted = amountFormatted;
        this.date = date;
    }

    public Integer getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getAmountFormatted() {
        return amountFormatted;
    }

    public String getDate() {
        return date;
    }
}
