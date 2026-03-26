package com.nhs.individual.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * Request body item for a bulk stock availability check.
 *
 * @param productItemId the product item to check
 * @param requestedQty  how many units the caller wants to buy
 */
public record StockCheckRequest(
        @NotNull(message = "productItemId is required")
        Integer productItemId,

        @NotNull(message = "requestedQty is required")
        @Min(value = 1, message = "requestedQty must be at least 1")
        Integer requestedQty
) {}
