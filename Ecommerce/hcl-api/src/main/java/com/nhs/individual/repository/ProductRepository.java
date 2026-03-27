package com.nhs.individual.repository;

import com.nhs.individual.domain.Product;
import io.micrometer.common.lang.NonNull;
import io.micrometer.common.lang.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Date;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product,Integer>, JpaSpecificationExecutor<Product> {
    Collection<Product> findAllByCategory_id(Integer categoryId);
    @Query(value = "select * from product\n" +
            "    join product_item on product.id = product_item.product_id\n" +
            "    join product_item_in_warehouse on product_item_in_warehouse.product_item_id=product_item.id\n" +
            "    where product_item_in_warehouse.warehouse_id=?1",nativeQuery = true)
    Collection<Product> findAllByWarehouseId(Integer warehouseId);

        @Query(value = """
            SELECT COUNT(*)
            FROM product p
            WHERE p.created_at >= :fromDate
              AND p.created_at < :toDate
            """, nativeQuery = true)
        Long countProductsCreatedBetween(
            @Param("fromDate") Date fromDate,
            @Param("toDate") Date toDate
        );

            @Query(value = """
                SELECT p.id AS productId,
                   p.name AS productName,
                   MAX(piw.sku) AS sku
                FROM product p
                LEFT JOIN product_item pi ON pi.product_id = p.id
                LEFT JOIN product_item_in_warehouse piw ON piw.product_item_id = pi.id
                WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))
                   OR LOWER(COALESCE(piw.sku, '')) LIKE LOWER(CONCAT('%', :query, '%'))
                GROUP BY p.id, p.name
                ORDER BY p.name ASC, p.id DESC
                LIMIT :limit
                """, nativeQuery = true)
            List<GlobalSearchProductProjection> searchProductsForAdmin(
                @Param("query") String query,
                @Param("limit") Integer limit
            );

    @NonNull
    Page<Product> findAll(@Nullable Specification<Product> specification, @NonNull Pageable pageable);

    @Modifying
    @Query(value = "UPDATE product SET status = :status WHERE id = :productId", nativeQuery = true)
    void updateProductStatus(@Param("productId") Integer productId, @Param("status") String status);

            interface GlobalSearchProductProjection {
            Integer getProductId();

            String getProductName();

            String getSku();
            }
}
