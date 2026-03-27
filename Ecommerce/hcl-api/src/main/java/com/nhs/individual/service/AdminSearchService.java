package com.nhs.individual.service;

import com.nhs.individual.dto.AdminGlobalSearchResponseDto;
import com.nhs.individual.dto.AdminSearchOrderDto;
import com.nhs.individual.dto.AdminSearchProductDto;
import com.nhs.individual.dto.AdminSearchUserDto;
import com.nhs.individual.repository.ProductRepository;
import com.nhs.individual.repository.ShopOrderRepository;
import com.nhs.individual.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminSearchService {
    private static final int DEFAULT_LIMIT = 5;
    private static final int MAX_LIMIT = 20;
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final ProductRepository productRepository;
    private final ShopOrderRepository shopOrderRepository;
    private final UserRepository userRepository;

    public AdminGlobalSearchResponseDto search(String query, Integer limit) {
        String normalizedQuery = query == null ? "" : query.trim();
        if (normalizedQuery.isBlank()) {
            return new AdminGlobalSearchResponseDto(List.of(), List.of(), List.of());
        }

        int safeLimit = limit == null || limit <= 0 ? DEFAULT_LIMIT : Math.min(limit, MAX_LIMIT);

        List<AdminSearchProductDto> products = productRepository.searchProductsForAdmin(normalizedQuery, safeLimit)
                .stream()
                .map(item -> new AdminSearchProductDto(
                        item.getProductId(),
                        item.getProductName(),
                        normalizeSku(item.getSku())
                ))
                .toList();

        List<AdminSearchOrderDto> orders = shopOrderRepository.searchOrdersForAdmin(normalizedQuery, safeLimit)
                .stream()
                .map(item -> {
                    BigDecimal amount = nonNull(item.getAmount());
                    return new AdminSearchOrderDto(
                            item.getOrderId(),
                            fullName(item.getFirstName(), item.getLastName()),
                            amount,
                            formatVnd(amount),
                            formatDateTime(item.getOrderDate())
                    );
                })
                .toList();

        List<AdminSearchUserDto> users = userRepository.searchUsersForAdmin(normalizedQuery, safeLimit)
                .stream()
                .map(item -> new AdminSearchUserDto(
                        item.getUserId(),
                        fullName(item.getFirstName(), item.getLastName()),
                        item.getEmail() == null ? "" : item.getEmail()
                ))
                .toList();

        return new AdminGlobalSearchResponseDto(products, orders, users);
    }

    private String normalizeSku(String sku) {
        if (sku == null || sku.isBlank()) {
            return "-";
        }
        return sku;
    }

    private String fullName(String firstName, String lastName) {
        String full = ((firstName == null ? "" : firstName.trim()) + " " + (lastName == null ? "" : lastName.trim())).trim();
        return full.isBlank() ? "Unknown" : full;
    }

    private BigDecimal nonNull(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
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
}
