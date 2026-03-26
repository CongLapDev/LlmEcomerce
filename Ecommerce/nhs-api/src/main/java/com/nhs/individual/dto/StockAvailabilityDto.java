package com.nhs.individual.dto;

/**
 * Read-only response describing the stock availability for a single product item.
 *
 * @param productItemId  the product item being queried
 * @param availableQty   total units currently available in all warehouses
 * @param isAvailable    true when availableQty >= requestedQty
 * @param message        human-readable reason when isAvailable is false, null otherwise
 */
public record StockAvailabilityDto(
        Integer productItemId,
        Integer availableQty,
        boolean isAvailable,
        String message
) {

    /** Factory for a passing availability check. */
    public static StockAvailabilityDto ok(Integer productItemId, Integer availableQty) {
        return new StockAvailabilityDto(productItemId, availableQty, true, null);
    }

    /** Factory for a failing availability check. */
    public static StockAvailabilityDto insufficient(Integer productItemId, Integer availableQty, Integer requested) {
        return new StockAvailabilityDto(
                productItemId,
                availableQty,
                false,
                availableQty == 0
                        ? "Out of stock"
                        : String.format("Only %d unit(s) left, but %d requested", availableQty, requested)
        );
    }
}
