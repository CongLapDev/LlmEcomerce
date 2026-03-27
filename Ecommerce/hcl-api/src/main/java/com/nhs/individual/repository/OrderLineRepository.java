package com.nhs.individual.repository;

import com.nhs.individual.domain.OrderLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderLineRepository extends JpaRepository<OrderLine,Integer> {
    @Query("SELECT COUNT(ol) > 0 FROM OrderLine ol WHERE ol.productItem.id = :productItemId")
    boolean existsByProductItemId(@Param("productItemId") Integer productItemId);
    
    @Query("SELECT COUNT(ol) > 0 FROM OrderLine ol WHERE ol.productItem.product.id = :productId")
    boolean existsByProductId(@Param("productId") Integer productId);

    @Query(value = """
            SELECT p.id AS productId,
                   p.name AS productName,
                   COALESCE(SUM(ol.qty), 0) AS salesVolume
            FROM order_line ol
            JOIN product_item pi ON pi.id = ol.product_item_id
            JOIN product p ON p.id = pi.product_id
            JOIN shop_order so ON so.id = ol.order_id
            WHERE EXISTS (
                SELECT 1
                FROM shop_order_status sos
                WHERE sos.shop_order_id = so.id
                  AND sos.status = :completedStatus
                  AND sos.id = (
                      SELECT sos2.id
                      FROM shop_order_status sos2
                      WHERE sos2.shop_order_id = so.id
                      ORDER BY sos2.update_at DESC, sos2.id DESC
                      LIMIT 1
                  )
            )
            GROUP BY p.id, p.name
            ORDER BY salesVolume DESC, p.id ASC
            LIMIT :limit
            """, nativeQuery = true)
    List<TopProductProjection> findTopProductsBySalesVolume(
            @Param("completedStatus") Integer completedStatus,
            @Param("limit") Integer limit
    );

    @Query(value = """
            SELECT c.id AS categoryId,
                   c.name AS categoryName,
                   COALESCE(SUM(ol.total), 0) AS revenue
            FROM order_line ol
            JOIN product_item pi ON pi.id = ol.product_item_id
            JOIN product p ON p.id = pi.product_id
            JOIN category c ON c.id = p.category_id
            JOIN shop_order so ON so.id = ol.order_id
            WHERE EXISTS (
                SELECT 1
                FROM shop_order_status sos
                WHERE sos.shop_order_id = so.id
                  AND sos.status = :completedStatus
                  AND sos.id = (
                      SELECT sos2.id
                      FROM shop_order_status sos2
                      WHERE sos2.shop_order_id = so.id
                      ORDER BY sos2.update_at DESC, sos2.id DESC
                      LIMIT 1
                  )
            )
            GROUP BY c.id, c.name
            ORDER BY revenue DESC, c.id ASC
            """, nativeQuery = true)
    List<CategoryRevenueProjection> findRevenueByCategory(@Param("completedStatus") Integer completedStatus);

    interface TopProductProjection {
        Integer getProductId();

        String getProductName();

        Long getSalesVolume();
    }

    interface CategoryRevenueProjection {
        Integer getCategoryId();

        String getCategoryName();

        BigDecimal getRevenue();
    }
}
