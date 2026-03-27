package com.nhs.individual.repository;

import com.nhs.individual.domain.EmbeddedId.ProductItemInWarehouseId;
import com.nhs.individual.domain.WarehouseItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.util.List;

@Repository
public interface WarehouseItemRepository extends JpaRepository<WarehouseItem, ProductItemInWarehouseId> {

    @Modifying
    @Query(value = "delete from product_item_in_warehouse where product_item_id in (select id from product_item where product_id = :productId)", nativeQuery = true)
    void deleteByProductId(@Param("productId") Integer productId);

    @Modifying
    @Query(value = "delete from product_item_in_warehouse where product_item_id = :productItemId", nativeQuery = true)
    void deleteByProductItemId(@Param("productItemId") Integer productItemId);

    @Query(value = """
            SELECT p.name AS productName, COALESCE(piw.quantity, 0) AS currentStock
            FROM product_item_in_warehouse piw
            JOIN product_item pi ON pi.id = piw.product_item_id
            JOIN product p ON p.id = pi.product_id
            WHERE COALESCE(piw.quantity, 0) < :threshold
            ORDER BY currentStock ASC, p.name ASC, piw.product_item_id ASC
            """, nativeQuery = true)
    List<LowStockProjection> findLowStockProducts(@Param("threshold") Integer threshold);

    @Query(value = """
            SELECT COUNT(*)
            FROM product_item_in_warehouse piw
            WHERE COALESCE(piw.quantity, 0) < :threshold
            """, nativeQuery = true)
    Long countLowStockProductItems(@Param("threshold") Integer threshold);

    @Query(value = """
            SELECT
            piw.product_item_id AS productItemId,
            p.name AS productName,
            piw.warehouse_id AS warehouseId,
            w.name AS warehouseName,
            piw.sku AS sku,
            COALESCE(piw.quantity, 0) AS quantity
            FROM product_item_in_warehouse piw
            JOIN product_item pi ON pi.id = piw.product_item_id
            JOIN product p ON p.id = pi.product_id
            JOIN warehouse w ON w.id = piw.warehouse_id
            ORDER BY p.name ASC, piw.warehouse_id ASC, piw.product_item_id ASC
            """, nativeQuery = true)
    List<StockLevelProjection> findAllStockLevels();

    @Query(value = "SELECT COALESCE(SUM(quantity), 0) FROM product_item_in_warehouse WHERE warehouse_id = :warehouseId", nativeQuery = true)
    Integer sumQuantityByWarehouseId(@Param("warehouseId") Integer warehouseId);

    @Query(value = "SELECT COALESCE(SUM(quantity), 0) FROM product_item_in_warehouse WHERE product_item_id = :productItemId", nativeQuery = true)
    Integer sumQuantityByProductItemId(@Param("productItemId") Integer productItemId);

    @Query("""
            SELECT wi
            FROM WarehouseItem wi
            WHERE wi.productItem.id = :productItemId
                AND COALESCE(wi.qty, 0) > 0
            ORDER BY wi.qty DESC, wi.warehouse.id ASC
            """)
    List<WarehouseItem> findAvailableStockByProductItemId(@Param("productItemId") Integer productItemId);

    /**
     * Same as {@code findAvailableStockByProductItemId} but acquires a row-level
     * pessimistic write lock (SELECT … FOR UPDATE).
     *
     * <p>MUST be called inside a {@code @Transactional} method. The lock is held
     * until the transaction commits or rolls back, preventing concurrent requests
     * from reading the same rows before stock is deducted.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT wi
            FROM WarehouseItem wi
            WHERE wi.productItem.id = :productItemId
                AND COALESCE(wi.qty, 0) > 0
            ORDER BY wi.qty DESC, wi.warehouse.id ASC
            """)
    List<WarehouseItem> findAvailableStockForUpdate(@Param("productItemId") Integer productItemId);

    /**
     * Finds all warehouse items (including depleted ones) with a row-level
     * pessimistic write lock. Used to restore stock after cancellation.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT wi
            FROM WarehouseItem wi
            WHERE wi.productItem.id = :productItemId
            ORDER BY wi.warehouse.id ASC
            """)
    List<WarehouseItem> findAllStockForUpdate(@Param("productItemId") Integer productItemId);

    // ─── Projections ────────────────────────────────────────────────────────────

    interface LowStockProjection {
        String getProductName();
        Integer getCurrentStock();
    }

    interface StockLevelProjection {
        Integer getProductItemId();
        String getProductName();
        Integer getWarehouseId();
        String getWarehouseName();
        String getSku();
        Integer getQuantity();
    }
}
