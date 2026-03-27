package com.nhs.individual.controller;

import com.nhs.individual.domain.Product;
import com.nhs.individual.dto.AdminProductListDto;
import com.nhs.individual.service.ProductService;
import com.nhs.individual.specification.ISpecification.IProductSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * AdminProductController - Provides product management endpoints for Admin Dashboard
 * Resolves hard-coded data in product management table by returning real API data
 * with calculated min/max prices and dynamic stock status
 */
@RestController
@RequestMapping({"/api/v1/admin/products", "/admin/products"})
@RequiredArgsConstructor
@Slf4j
public class AdminProductController {
    private final ProductService productService;

    /**
     * GET /api/v1/admin/products
     * Returns paginated products with calculated prices and stock information
     * 
     * Query Parameters:
     * - page: Page number (0-indexed)
     * - size: Page size (default 10)
     * - category: Category IDs (comma-separated)
     * - name: Product name filter
     * - price-min: Minimum price
     * - price-max: Maximum price
     */
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN')")
    public Page<AdminProductListDto> getAdminProducts(
            @RequestParam(name = "page", defaultValue = "0") Integer page,
            @RequestParam(name = "size", defaultValue = "10") Integer size,
            @RequestParam(name = "category", required = false) List<Integer> category,
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "price-min", required = false) BigDecimal priceMin,
            @RequestParam(name = "price-max", required = false) BigDecimal priceMax) {
        
        log.info("Fetching admin products - page={}, size={}, category={}, name={}", page, size, category, name);
        
        // Build specifications
        List<Specification<Product>> specifications = new ArrayList<>();
        if (category != null && !category.isEmpty()) {
            specifications.add(IProductSpecification.inCategory(category));
        }
        if (name != null && !name.isBlank()) {
            specifications.add(IProductSpecification.hasName(name));
        }
        if (priceMin != null && priceMax != null) {
            specifications.add(IProductSpecification.priceLimit(priceMin, priceMax));
        }
        
        // Fetch products
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage = productService.findAll(specifications, pageable);
        
        // Convert to AdminProductListDto with calculated fields
        List<AdminProductListDto> dtoList = productPage.getContent().stream()
                .map(product -> new AdminProductListDto(
                        product,
                        productService.calculateMinPrice(product),
                        productService.calculateMaxPrice(product),
                        productService.calculateTotalStock(product)
                ))
                .toList();
        
        // Return as paginated response
        return new PageImpl<>(dtoList, pageable, productPage.getTotalElements());
    }
}
