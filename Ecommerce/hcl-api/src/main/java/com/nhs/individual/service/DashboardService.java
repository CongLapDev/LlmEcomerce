package com.nhs.individual.service;

import com.nhs.individual.constant.OrderStatus;
import com.nhs.individual.dto.ActivityFeedItemDto;
import com.nhs.individual.dto.AdminDashboardStatsDto;
import com.nhs.individual.dto.CategoryRevenueDto;
import com.nhs.individual.dto.LowStockAlertDto;
import com.nhs.individual.dto.RecentOrderRowDto;
import com.nhs.individual.dto.SalesOverviewPointDto;
import com.nhs.individual.dto.TopCustomerDto;
import com.nhs.individual.dto.TopProductDto;
import com.nhs.individual.dto.UserGrowthPointDto;
import com.nhs.individual.repository.OrderLineRepository;
import com.nhs.individual.repository.ProductRepository;
import com.nhs.individual.repository.ShopOrderRepository;
import com.nhs.individual.repository.UserRepository;
import com.nhs.individual.repository.WarehouseItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {
    private final ShopOrderRepository shopOrderRepository;
        private final OrderLineRepository orderLineRepository;
        private final ProductRepository productRepository;
    private final UserRepository userRepository;
        private final WarehouseItemRepository warehouseItemRepository;

        private static final int LOW_STOCK_THRESHOLD = 5;
        private static final int ACTIVITY_LIMIT = 5;
        private static final int TOP_LIMIT = 5;
        private static final int DEFAULT_SALES_DAYS = 30;
        private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;
        private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        public List<SalesOverviewPointDto> getSalesOverview(LocalDate from, LocalDate to, Integer days) {
                LocalDate now = LocalDate.now();
                int rangeDays = days == null || days <= 0 ? DEFAULT_SALES_DAYS : days;

                LocalDate start = from != null ? from : now.minusDays(rangeDays - 1L);
                LocalDate end = to != null ? to : now;

                if (end.isBefore(start)) {
                        LocalDate temp = start;
                        start = end;
                        end = temp;
                }

                List<SalesOverviewPointDto> points = new ArrayList<>();
                for (LocalDate d = start; !d.isAfter(end); d = d.plusDays(1)) {
                        Date dayStart = asDate(d);
                        Date nextDayStart = asDate(d.plusDays(1));

                        BigDecimal revenue = nonNull(
                                        shopOrderRepository.sumCompletedRevenueBetween(
                                                        dayStart,
                                                        nextDayStart,
                                                        OrderStatus.COMPLETED.id
                                        )
                        );

                        points.add(new SalesOverviewPointDto(d.format(DATE_FORMATTER), revenue));
                }

                return points;
        }

        public List<UserGrowthPointDto> getUserGrowthCurrentMonth() {
                LocalDate now = LocalDate.now();
                LocalDate start = now.withDayOfMonth(1);
                LocalDate end = now;

                List<UserGrowthPointDto> points = new ArrayList<>();
                for (LocalDate d = start; !d.isAfter(end); d = d.plusDays(1)) {
                        Date dayStart = asDate(d);
                        Date nextDayStart = asDate(d.plusDays(1));

                        Long count = nonNull(userRepository.countRegisteredUsersBetween(dayStart, nextDayStart));
                        points.add(new UserGrowthPointDto(d.format(DATE_FORMATTER), count));
                }

                return points;
        }

        public List<RecentOrderRowDto> getRecentOrders(Integer limit) {
                int safeLimit = limit == null || limit <= 0 ? 10 : Math.min(limit, 50);

                return shopOrderRepository.findRecentOrderRows(safeLimit)
                                .stream()
                                .map(order -> {
                                        BigDecimal amount = nonNull(order.getAmount());
                                        return new RecentOrderRowDto(
                                                        order.getOrderId(),
                                                        fullName(order.getFirstName(), order.getLastName()),
                                                        order.getFirstProductName() == null || order.getFirstProductName().isBlank()
                                                                        ? "No items"
                                                                        : order.getFirstProductName(),
                                                        amount,
                                                        formatVnd(amount),
                                                        toDashboardStatus(order.getLatestStatus()),
                                                        formatDateTime(order.getOrderDate())
                                        );
                                })
                                .toList();
        }

    public AdminDashboardStatsDto getAdminStats() {
        LocalDate now = LocalDate.now();

        LocalDate currentMonthStart = now.withDayOfMonth(1);
        LocalDate nextMonthStart = currentMonthStart.plusMonths(1);
        LocalDate previousMonthStart = currentMonthStart.minusMonths(1);

        Date currentMonthStartDate = asDate(currentMonthStart);
        Date nextMonthStartDate = asDate(nextMonthStart);
        Date previousMonthStartDate = asDate(previousMonthStart);

        LocalDate today = now;
        LocalDate tomorrow = today.plusDays(1);
        LocalDate yesterday = today.minusDays(1);

        Date todayStartDate = asDate(today);
        Date tomorrowStartDate = asDate(tomorrow);
        Date yesterdayStartDate = asDate(yesterday);

        log.info(
                "Dashboard date windows - current [{} -> {}), previous [{} -> {})",
                currentMonthStartDate,
                nextMonthStartDate,
                previousMonthStartDate,
                currentMonthStartDate
        );

        BigDecimal totalRevenue = nonNull(
                shopOrderRepository.sumCompletedRevenue(OrderStatus.COMPLETED.id)
        );

        BigDecimal currentMonthRevenue = nonNull(
                shopOrderRepository.sumCompletedRevenueBetween(
                        currentMonthStartDate,
                        nextMonthStartDate,
                        OrderStatus.COMPLETED.id
                )
        );

        BigDecimal previousMonthRevenue = nonNull(
                shopOrderRepository.sumCompletedRevenueBetween(
                        previousMonthStartDate,
                        currentMonthStartDate,
                        OrderStatus.COMPLETED.id
                )
        );

        long totalUsers = userRepository.count();

        long currentMonthUsers = nonNull(
                userRepository.countRegisteredUsersBetween(
                        currentMonthStartDate,
                        nextMonthStartDate
                )
        );

        long previousMonthUsers = nonNull(
                userRepository.countRegisteredUsersBetween(
                        previousMonthStartDate,
                        currentMonthStartDate
                )
        );

        long ordersToday = nonNull(
                shopOrderRepository.countOrdersBetween(todayStartDate, tomorrowStartDate)
        );

        long ordersYesterday = nonNull(
                shopOrderRepository.countOrdersBetween(yesterdayStartDate, todayStartDate)
        );

        long totalProducts = productRepository.count();

        long currentMonthNewProducts = nonNull(
                productRepository.countProductsCreatedBetween(currentMonthStartDate, nextMonthStartDate)
        );

        long previousMonthNewProducts = nonNull(
                productRepository.countProductsCreatedBetween(previousMonthStartDate, currentMonthStartDate)
        );

        List<TopProductDto> topProducts = orderLineRepository
                .findTopProductsBySalesVolume(OrderStatus.COMPLETED.id, TOP_LIMIT)
                .stream()
                .map(item -> new TopProductDto(
                        item.getProductId(),
                        item.getProductName(),
                        nonNull(item.getSalesVolume())
                ))
                .toList();

        List<TopCustomerDto> topCustomers = shopOrderRepository
                .findTopCustomersBySpending(OrderStatus.COMPLETED.id, TOP_LIMIT)
                .stream()
                .map(item -> new TopCustomerDto(
                        item.getUserId(),
                        fullName(item.getFirstName(), item.getLastName()),
                        nonNull(item.getTotalSpend()),
                        nonNull(item.getOrderCount())
                ))
                .toList();

        List<CategoryRevenueDto> categoryRevenue = orderLineRepository
                .findRevenueByCategory(OrderStatus.COMPLETED.id)
                .stream()
                .map(item -> new CategoryRevenueDto(
                        item.getCategoryId(),
                        item.getCategoryName(),
                        nonNull(item.getRevenue())
                ))
                .toList();

        log.info(
                "Dashboard aggregates - totalRevenue={}, currentMonthRevenue={}, previousMonthRevenue={}, totalUsers={}, currentMonthUsers={}, previousMonthUsers={}, ordersToday={}, ordersYesterday={}, totalProducts={}, currentMonthNewProducts={}, previousMonthNewProducts={}",
                totalRevenue,
                currentMonthRevenue,
                previousMonthRevenue,
                totalUsers,
                currentMonthUsers,
                previousMonthUsers,
                ordersToday,
                ordersYesterday,
                totalProducts,
                currentMonthNewProducts,
                previousMonthNewProducts
        );

        List<LowStockAlertDto> lowStockAlerts = getLowStockAlerts(LOW_STOCK_THRESHOLD);
        Long lowStockCount = nonNull(warehouseItemRepository.countLowStockProductItems(LOW_STOCK_THRESHOLD));

        List<ActivityFeedItemDto> activityFeed = buildRecentActivityFeed();

        return new AdminDashboardStatsDto(
                totalRevenue,
                totalUsers,
                calculateGrowthPercent(currentMonthRevenue, previousMonthRevenue),
                                calculateGrowthPercent(BigDecimal.valueOf(currentMonthUsers), BigDecimal.valueOf(previousMonthUsers)),
                                ordersToday,
                                calculateGrowthPercent(BigDecimal.valueOf(ordersToday), BigDecimal.valueOf(ordersYesterday)),
                                totalProducts,
                                calculateGrowthPercent(BigDecimal.valueOf(currentMonthNewProducts), BigDecimal.valueOf(previousMonthNewProducts)),
                                                                lowStockCount,
                                lowStockAlerts,
                                activityFeed,
                                topProducts,
                                topCustomers,
                                categoryRevenue
        );
    }

                public List<LowStockAlertDto> getLowStockAlerts(Integer threshold) {
                                int safeThreshold = threshold == null || threshold <= 0 ? LOW_STOCK_THRESHOLD : threshold;
                                return warehouseItemRepository
                                                                .findLowStockProducts(safeThreshold)
                                                                .stream()
                                                                .map(item -> new LowStockAlertDto(item.getProductName(), nonNull(item.getCurrentStock())))
                                                                .toList();
                }

        private List<ActivityFeedItemDto> buildRecentActivityFeed() {
                List<ActivityFeedItemDto> events = new ArrayList<>();

                shopOrderRepository.findRecentOrderActivities(ACTIVITY_LIMIT).forEach(order -> {
                        Instant createdAt = asInstant(order.getCreatedAt());
                        if (createdAt == null) {
                                return;
                        }

                        String displayName = fullName(order.getFirstName(), order.getLastName());
                        String message = "New order #" + order.getOrderId() + " placed by " + displayName;
                        events.add(new ActivityFeedItemDto(message, createdAt));
                });

                userRepository.findRecentUserActivities(ACTIVITY_LIMIT).forEach(user -> {
                        Instant createdAt = asInstant(user.getCreatedAt());
                        if (createdAt == null) {
                                return;
                        }

                        String displayName = fullName(user.getFirstName(), user.getLastName());
                        String message = displayName + " just registered";
                        events.add(new ActivityFeedItemDto(message, createdAt));
                });

                return events.stream()
                                .sorted(Comparator.comparing(ActivityFeedItemDto::getCreatedAt).reversed())
                                .limit(ACTIVITY_LIMIT)
                                .toList();
        }

    private Date asDate(LocalDate date) {
        return Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());
    }

        private Instant asInstant(Date date) {
                return date == null ? null : date.toInstant();
        }

        private String fullName(String firstName, String lastName) {
                String full = ((firstName == null ? "" : firstName.trim()) + " " + (lastName == null ? "" : lastName.trim())).trim();
                return full.isBlank() ? "Unknown user" : full;
        }

        private String toDashboardStatus(Integer statusId) {
                if (statusId == null) {
                        return "preparing";
                }

                if (statusId == OrderStatus.DELIVERED.id || statusId == OrderStatus.COMPLETED.id) {
                        return "delivered";
                }

                if (statusId == OrderStatus.CANCELLED.id || statusId == OrderStatus.RETURNED.id) {
                        return "cancelled";
                }

                return "preparing";
        }

        private String formatVnd(BigDecimal amount) {
                return amount.toBigInteger().toString().replaceAll("\\B(?=(\\d{3})+(?!\\d))", ".") + " ₫";
        }

        private String formatDateTime(Date value) {
                if (value == null) {
                        return "-";
                }
                LocalDateTime dateTime = LocalDateTime.ofInstant(value.toInstant(), ZoneId.systemDefault());
                return dateTime.format(DATETIME_FORMATTER);
        }

    private BigDecimal calculateGrowthPercent(BigDecimal current, BigDecimal previous) {
        if (previous.compareTo(BigDecimal.ZERO) == 0) {
                        return current.compareTo(BigDecimal.ZERO) > 0
                                        ? BigDecimal.valueOf(100)
                                        : BigDecimal.ZERO;
        }

        return current.subtract(previous)
                .divide(previous, 6, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal nonNull(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

        private Integer nonNull(Integer value) {
                return value == null ? 0 : value;
        }

    private Long nonNull(Long value) {
        return value == null ? 0L : value;
    }
}
