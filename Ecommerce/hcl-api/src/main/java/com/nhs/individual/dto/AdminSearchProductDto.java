package com.nhs.individual.dto;

import java.io.Serializable;

public class AdminSearchProductDto implements Serializable {
    private final Integer id;
    private final String name;
    private final String sku;

    public AdminSearchProductDto(Integer id, String name, String sku) {
        this.id = id;
        this.name = name;
        this.sku = sku;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSku() {
        return sku;
    }
}
