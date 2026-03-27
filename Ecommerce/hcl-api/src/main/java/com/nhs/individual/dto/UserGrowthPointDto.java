package com.nhs.individual.dto;

import java.io.Serializable;

public class UserGrowthPointDto implements Serializable {
    private final String date;
    private final Long count;

    public UserGrowthPointDto(String date, Long count) {
        this.date = date;
        this.count = count;
    }

    public String getDate() {
        return date;
    }

    public Long getCount() {
        return count;
    }
}