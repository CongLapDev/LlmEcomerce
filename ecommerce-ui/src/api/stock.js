import APIBase from "./ApiBase";

/**
 * Checks stock availability for an array of items.
 *
 * @param {Array<{productItemId: number, requestedQty: number}>} items
 * @returns {Promise<Array<{productItemId: number, availableQty: number, isAvailable: boolean, message: string | null}>>}
 */
export const checkStock = async (items) => {
    // Requires an array of StockCheckRequest objects
    if (!items || items.length === 0) return [];
    
    // Using POST as dictated by the StockController
    const response = await APIBase.post("/api/v1/stock/check", items);
    return response.data;
};
