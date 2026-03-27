package com.nhs.individual.service;

import com.nhs.individual.dto.StockAvailabilityDto;
import com.nhs.individual.dto.StockCheckRequest;
import com.nhs.individual.exception.InsufficientStockException;
import com.nhs.individual.repository.WarehouseItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Read-only stock validation service.
 *
 * <p>Two distinct contracts:
 * <ul>
 *   <li>{@link #checkBulk} — pure query, never throws, used by the API endpoint for the UI.</li>
 *   <li>{@link #assertSufficientStock} — throws {@link InsufficientStockException} on the first
 *       item that cannot be fulfilled; used as a pre-flight inside
 *       {@code ShopOrderService.deductStockForOrder()}.</li>
 * </ul>
 *
 * <p>Neither method deducts stock — that responsibility stays in {@code ShopOrderService}.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StockValidationService {

    private final WarehouseItemRepository warehouseItemRepository;

    /**
     * Returns the stock availability for every requested item.
     * Never throws — failures are expressed as {@code isAvailable = false} in the result.
     */
    public List<StockAvailabilityDto> checkBulk(List<StockCheckRequest> items) {
        return items.stream()
                .map(this::checkSingle)
                .toList();
    }

    /**
     * Validates all items and throws {@link InsufficientStockException} on the first failure.
     * Intended to be called inside a transaction before any stock deduction.
     */
    public void assertSufficientStock(List<StockCheckRequest> items) {
        for (StockCheckRequest item : items) {
            StockAvailabilityDto result = checkSingle(item);
            if (!result.isAvailable()) {
                log.warn("Stock insufficient for productItemId={}: requested={}, available={}",
                        item.productItemId(), item.requestedQty(), result.availableQty());
                throw new InsufficientStockException(
                        item.productItemId(),
                        item.requestedQty(),
                        result.availableQty()
                );
            }
        }
    }

    // ─── private ────────────────────────────────────────────────────────────────

    private StockAvailabilityDto checkSingle(StockCheckRequest item) {
        int available = safeInt(warehouseItemRepository.sumQuantityByProductItemId(item.productItemId()));
        log.debug("Stock check: productItemId={} available={} requested={}",
                item.productItemId(), available, item.requestedQty());

        if (available >= item.requestedQty()) {
            return StockAvailabilityDto.ok(item.productItemId(), available);
        }
        return StockAvailabilityDto.insufficient(item.productItemId(), available, item.requestedQty());
    }

    private static int safeInt(Integer value) {
        return value == null ? 0 : value;
    }
}
