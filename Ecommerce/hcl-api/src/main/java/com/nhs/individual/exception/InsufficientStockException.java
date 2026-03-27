package com.nhs.individual.exception;

import lombok.Getter;

@Getter
public class InsufficientStockException extends ResponseException {

    private final Integer productItemId;
    private final Integer requested;
    private final Integer available;

    public InsufficientStockException(Integer productItemId, Integer requested, Integer available) {
        super(String.format(
                "Insufficient stock for product item %d: requested %d but only %d available",
                productItemId, requested, available
        ));
        this.productItemId = productItemId;
        this.requested = requested;
        this.available = available;
    }
}
