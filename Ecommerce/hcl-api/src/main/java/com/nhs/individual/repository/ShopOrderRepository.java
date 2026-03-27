package com.nhs.individual.repository;

import com.nhs.individual.domain.ShopOrder;
import io.micrometer.common.lang.NonNull;
import io.micrometer.common.lang.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Repository
public interface ShopOrderRepository extends JpaRepository<ShopOrder, Integer> {
    List<ShopOrder> findAllByUser_Id(Integer userId, Pageable pageable);

    @NonNull
    Page<ShopOrder> findAll(@Nullable Specification<ShopOrder> specification, @NonNull Pageable pageable);

    @Query(value = """
            SELECT COALESCE(SUM(so.total), 0)
            FROM shop_order so
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
            """, nativeQuery = true)
    BigDecimal sumCompletedRevenue(@Param("completedStatus") Integer completedStatus);

    @Query(value = """
            SELECT COALESCE(SUM(so.total), 0)
            FROM shop_order so
            WHERE so.order_date >= :fromDate
              AND so.order_date < :toDate
              AND EXISTS (
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
            """, nativeQuery = true)
    BigDecimal sumCompletedRevenueBetween(
            @Param("fromDate") Date fromDate,
            @Param("toDate") Date toDate,
            @Param("completedStatus") Integer completedStatus
    );

        @Query(value = """
          SELECT COUNT(*)
          FROM shop_order so
          WHERE so.order_date >= :fromDate
            AND so.order_date < :toDate
          """, nativeQuery = true)
        Long countOrdersBetween(
          @Param("fromDate") Date fromDate,
          @Param("toDate") Date toDate
        );

    @Query(value = """
        SELECT so.id AS orderId,
             so.order_date AS createdAt,
             u.firstname AS firstName,
             u.lastname AS lastName
        FROM shop_order so
        LEFT JOIN `user` u ON u.id = so.user_id
        WHERE so.order_date IS NOT NULL
        AND so.order_date >= '2000-01-01'
        ORDER BY so.order_date DESC, so.id DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<RecentOrderActivityProjection> findRecentOrderActivities(@Param("limit") Integer limit);

    @Query(value = """
      SELECT u.id AS userId,
           u.firstname AS firstName,
           u.lastname AS lastName,
           COALESCE(SUM(so.total), 0) AS totalSpend,
           COUNT(so.id) AS orderCount
      FROM shop_order so
      JOIN `user` u ON u.id = so.user_id
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
      GROUP BY u.id, u.firstname, u.lastname
      ORDER BY totalSpend DESC, orderCount DESC, u.id ASC
      LIMIT :limit
      """, nativeQuery = true)
    List<TopCustomerProjection> findTopCustomersBySpending(
        @Param("completedStatus") Integer completedStatus,
        @Param("limit") Integer limit
    );

    @Query(value = """
      SELECT so.id AS orderId,
         so.order_date AS orderDate,
         COALESCE(so.total, 0) AS amount,
         u.firstname AS firstName,
         u.lastname AS lastName,
         (
           SELECT p.name
           FROM order_line ol
           JOIN product_item pi ON pi.id = ol.product_item_id
           JOIN product p ON p.id = pi.product_id
           WHERE ol.order_id = so.id
           ORDER BY ol.id ASC
           LIMIT 1
         ) AS firstProductName,
         (
           SELECT sos.status
           FROM shop_order_status sos
           WHERE sos.shop_order_id = so.id
           ORDER BY sos.update_at DESC, sos.id DESC
           LIMIT 1
         ) AS latestStatus
      FROM shop_order so
      LEFT JOIN `user` u ON u.id = so.user_id
      WHERE so.order_date IS NOT NULL
      ORDER BY so.order_date DESC, so.id DESC
      LIMIT :limit
      """, nativeQuery = true)
    List<RecentOrderRowProjection> findRecentOrderRows(@Param("limit") Integer limit);

    @Query(value = """
      SELECT so.id AS orderId,
             so.order_date AS orderDate,
             COALESCE(so.total, 0) AS amount,
             u.firstname AS firstName,
             u.lastname AS lastName
      FROM shop_order so
      LEFT JOIN `user` u ON u.id = so.user_id
      WHERE CAST(so.id AS CHAR) LIKE CONCAT('%', :query, '%')
      ORDER BY so.order_date DESC, so.id DESC
      LIMIT :limit
      """, nativeQuery = true)
    List<GlobalSearchOrderProjection> searchOrdersForAdmin(
      @Param("query") String query,
      @Param("limit") Integer limit
    );

    interface RecentOrderActivityProjection {
      Integer getOrderId();

      Date getCreatedAt();

      String getFirstName();

      String getLastName();
    }

    interface TopCustomerProjection {
      Integer getUserId();

      String getFirstName();

      String getLastName();

      BigDecimal getTotalSpend();

      Long getOrderCount();
    }

    interface RecentOrderRowProjection {
      Integer getOrderId();

      Date getOrderDate();

      BigDecimal getAmount();

      String getFirstName();

      String getLastName();

      String getFirstProductName();

      Integer getLatestStatus();
    }

    interface GlobalSearchOrderProjection {
      Integer getOrderId();

      Date getOrderDate();

      BigDecimal getAmount();

      String getFirstName();

      String getLastName();
    }

}
