import { useState, useEffect, useCallback, useRef } from "react";
import { checkStock } from "../api/stock";

/**
 * Custom hook to validate stock for cart items with caching and debouncing.
 * 
 * @param {Array<{productItem: {id: number}, qty: number}>} cartData The current cart items
 * @returns {{
 *  stockMap: Record<number, { isAvailable: boolean, availableQty: number, message: string }>,
 *  isLoading: boolean,
 *  hasOutOfStock: (selectedItemIds: number[]) => boolean
 * }}
 */
export function useStockValidation(cartData) {
    const [stockMap, setStockMap] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    
    // Cache: { productItemId: availableQty }
    // We only need to cache absolute available qty since requestedQty changes often
    const cacheRef = useRef({});
    
    // Timer reference for debouncing
    const debounceTimerRef = useRef(null);

    // Main validation function
    const validateStock = useCallback(() => {
        if (!cartData || cartData.length === 0) {
            setStockMap({});
            return;
        }

        const itemsToFetch = [];
        const newStockMap = { ...stockMap };
        let mapChanged = false;

        cartData.forEach(item => {
            const productItemId = item?.productItem?.id;
            const requestedQty = item?.qty || 1;

            if (!productItemId) return;

            if (cacheRef.current[productItemId] !== undefined) {
                // We have cached available quantity
                const availableQty = cacheRef.current[productItemId];
                const isAvailable = availableQty >= requestedQty;
                
                // Update map if it changed
                const currentRecord = newStockMap[productItemId];
                if (!currentRecord || currentRecord.isAvailable !== isAvailable || currentRecord.availableQty !== availableQty) {
                    newStockMap[productItemId] = {
                        productItemId,
                        availableQty,
                        isAvailable,
                        message: availableQty === 0 ? "Out of stock" : isAvailable ? null : `Only ${availableQty} unit(s) left`
                    };
                    mapChanged = true;
                }
            } else {
                // We need to fetch this from backend
                itemsToFetch.push({ productItemId, requestedQty });
            }
        });

        if (mapChanged && itemsToFetch.length === 0) {
            setStockMap(newStockMap);
        }

        // If there are unseen items, delay API call by 500ms
        if (itemsToFetch.length > 0) {
            setIsLoading(true);
            
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            debounceTimerRef.current = setTimeout(() => {
                checkStock(itemsToFetch)
                    .then(results => {
                        let innerMapChanged = mapChanged;
                        
                        results.forEach(res => {
                            // Update our persistent cache
                            cacheRef.current[res.productItemId] = res.availableQty;
                            
                            // Re-evaluate current requested vs new cached available
                            const cartItem = cartData.find(i => i.productItem?.id === res.productItemId);
                            const currentReqQty = cartItem?.qty || 1;
                            const isAv = res.availableQty >= currentReqQty;

                            newStockMap[res.productItemId] = {
                                productItemId: res.productItemId,
                                availableQty: res.availableQty,
                                isAvailable: isAv,
                                message: res.availableQty === 0 ? "Out of stock" : isAv ? null : `Only ${res.availableQty} unit(s) left`
                            };
                            innerMapChanged = true;
                        });

                        if (innerMapChanged) {
                            setStockMap({ ...newStockMap });
                        }
                    })
                    .catch(err => {
                        console.error("Debounced stock check failed", err);
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            }, 500);
        }
    }, [cartData, stockMap]);

    useEffect(() => {
        validateStock();
        
        // Cleanup timer on unmount
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [cartData]);

    const hasOutOfStock = useCallback((selectedItems) => {
        if (!selectedItems || selectedItems.length === 0) return false;
        return selectedItems.some(item => {
            const pid = item?.productItem?.id;
            if (!pid) return false;
            const record = stockMap[pid];
            return record && !record.isAvailable;
        });
    }, [stockMap]);

    return { stockMap, isLoading, hasOutOfStock };
}
