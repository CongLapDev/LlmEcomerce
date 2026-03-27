package com.nhs.individual.dto;

import java.io.Serializable;
import java.util.List;

public class AdminGlobalSearchResponseDto implements Serializable {
    private final List<AdminSearchProductDto> products;
    private final List<AdminSearchOrderDto> orders;
    private final List<AdminSearchUserDto> users;

    public AdminGlobalSearchResponseDto(
            List<AdminSearchProductDto> products,
            List<AdminSearchOrderDto> orders,
            List<AdminSearchUserDto> users
    ) {
        this.products = products == null ? List.of() : products;
        this.orders = orders == null ? List.of() : orders;
        this.users = users == null ? List.of() : users;
    }

    public List<AdminSearchProductDto> getProducts() {
        return products;
    }

    public List<AdminSearchOrderDto> getOrders() {
        return orders;
    }

    public List<AdminSearchUserDto> getUsers() {
        return users;
    }
}
