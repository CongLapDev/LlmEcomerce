package com.nhs.individual.dto;

import java.io.Serializable;
import java.time.Instant;

public class ActivityFeedItemDto implements Serializable {
    private final String message;
    private final Instant createdAt;

    public ActivityFeedItemDto(String message, Instant createdAt) {
        this.message = message;
        this.createdAt = createdAt;
    }

    public String getMessage() {
        return message;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
