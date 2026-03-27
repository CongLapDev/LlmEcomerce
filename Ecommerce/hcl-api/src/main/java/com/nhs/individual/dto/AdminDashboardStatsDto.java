package com.nhs.individual.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

public class AdminDashboardStatsDto implements Serializable {
    private final BigDecimal totalRevenue;
    private final Long totalUsers;
    private final BigDecimal revenueGrowthRate;
    private final BigDecimal usersGrowthRate;
    private final Long ordersToday;
    private final BigDecimal ordersTodayGrowth;
    private final Long totalProducts;
    private final BigDecimal productsGrowth;
    private final Long lowStockCount;
    private final List<LowStockAlertDto> lowStockAlerts;
    private final List<ActivityFeedItemDto> activityFeed;
    private final List<TopProductDto> topProducts;
    private final List<TopCustomerDto> topCustomers;
    private final List<CategoryRevenueDto> categoryRevenue;

    public AdminDashboardStatsDto(
            BigDecimal totalRevenue,
            Long totalUsers,
            BigDecimal revenueGrowthRate,
            BigDecimal usersGrowthRate,
            Long ordersToday,
            BigDecimal ordersTodayGrowth,
            Long totalProducts,
            BigDecimal productsGrowth,
            Long lowStockCount,
            List<LowStockAlertDto> lowStockAlerts,
            List<ActivityFeedItemDto> activityFeed,
            List<TopProductDto> topProducts,
            List<TopCustomerDto> topCustomers,
            List<CategoryRevenueDto> categoryRevenue
    ) {
        this.totalRevenue = totalRevenue;
        this.totalUsers = totalUsers;
        this.revenueGrowthRate = revenueGrowthRate;
        this.usersGrowthRate = usersGrowthRate;
        this.ordersToday = ordersToday;
        this.ordersTodayGrowth = ordersTodayGrowth;
        this.totalProducts = totalProducts;
        this.productsGrowth = productsGrowth;
        this.lowStockCount = lowStockCount == null ? 0L : lowStockCount;
        this.lowStockAlerts = lowStockAlerts == null ? List.of() : lowStockAlerts;
        this.activityFeed = activityFeed == null ? List.of() : activityFeed;
        this.topProducts = topProducts == null ? List.of() : topProducts;
        this.topCustomers = topCustomers == null ? List.of() : topCustomers;
        this.categoryRevenue = categoryRevenue == null ? List.of() : categoryRevenue;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public BigDecimal getRevenueGrowthRate() {
        return revenueGrowthRate;
    }

    public BigDecimal getRevenueGrowth() {
        return revenueGrowthRate;
    }

    public BigDecimal getUsersGrowthRate() {
        return usersGrowthRate;
    }

    public BigDecimal getUsersGrowth() {
        return usersGrowthRate;
    }

    public Long getOrdersToday() {
        return ordersToday;
    }

    public BigDecimal getOrdersTodayGrowth() {
        return ordersTodayGrowth;
    }

    public Long getTotalProducts() {
        return totalProducts;
    }

    public BigDecimal getProductsGrowth() {
        return productsGrowth;
    }

    public Long getLowStockCount() {
        return lowStockCount;
    }

    public List<LowStockAlertDto> getLowStockAlerts() {
        return lowStockAlerts;
    }

    public List<ActivityFeedItemDto> getActivityFeed() {
        return activityFeed;
    }

    public List<TopProductDto> getTopProducts() {
        return topProducts;
    }

    public List<TopCustomerDto> getTopCustomers() {
        return topCustomers;
    }

    public List<CategoryRevenueDto> getCategoryRevenue() {
        return categoryRevenue;
    }
}
