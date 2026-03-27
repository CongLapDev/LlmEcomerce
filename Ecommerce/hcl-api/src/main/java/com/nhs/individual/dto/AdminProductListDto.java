package com.nhs.individual.dto;

import com.nhs.individual.domain.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * DTO for Product list view in Admin Panel
 * Includes calculated min/max pricing and stock status
 */
@AllArgsConstructor
@Getter
@ToString
public class AdminProductListDto implements Serializable {
    private final Integer id;
    private final String name;
    private final String description;
    private final String picture;
    private final String manufacturer;
    private final CategoryDto category;
    private final BigDecimal minPrice;
    private final BigDecimal maxPrice;
    private final Long totalStock;
    private final Boolean isActive;

    /**
     * Constructor from Product entity with calculated fields
     */
    public AdminProductListDto(
            Product product,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Long totalStock) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.picture = product.getPicture();
        this.manufacturer = product.getManufacturer();
        this.category = product.getCategory() != null
                ? new CategoryDto(product.getCategory().getId(), product.getCategory().getName())
                : null;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.totalStock = totalStock;
        this.isActive = "AVAILABLE".equals(product.getStatus());
    }

    /**
     * Nested DTO for Category
     */
    @AllArgsConstructor
    @Getter
    @ToString
    public static class CategoryDto {
        private final Integer id;
        private final String name;
    }
}
