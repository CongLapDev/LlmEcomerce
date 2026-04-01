package com.nhs.individual.controller;

import com.nhs.individual.dto.StockAvailabilityDto;
import com.nhs.individual.dto.StockCheckRequest;
import com.nhs.individual.service.StockValidationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Read-only stock availability endpoint.
 *
 * <p>Used by the frontend to validate cart items before showing the checkout page
 * and to display per-item stock warning badges in the cart.
 *
 * <p>This endpoint NEVER deducts stock — it is a pure query.
 *
 * <pre>
 * POST /api/v1/stock/check
 * Body: [{ "productItemId": 1, "requestedQty": 2 }]
 *
 * 200 OK:
 * [
 *   { "productItemId": 1, "availableQty": 5, "isAvailable": true, "message": null },
 *   { "productItemId": 7, "availableQty": 0, "isAvailable": false, "message": "Out of stock" }
 * ]
 * </pre>
 */
@RestController
@RequestMapping("/api/v1/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockValidationService stockValidationService;

    /**
     * Bulk stock availability check.
     * Public endpoint used during checkout validation.
     */
    @PostMapping("/check")
    public List<StockAvailabilityDto> checkStock(
            @Valid @RequestBody List<@Valid StockCheckRequest> items) {
        return stockValidationService.checkBulk(items);
    }
}
