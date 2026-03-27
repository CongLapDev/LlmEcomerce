package com.nhs.individual.dto;

import com.nhs.individual.constant.WarehouseStatus;

import java.io.Serializable;

public class WarehouseStatusUpdateRequest implements Serializable {
    private WarehouseStatus status;
    private Boolean manualOverride;

    public WarehouseStatus getStatus() {
        return status;
    }

    public void setStatus(WarehouseStatus status) {
        this.status = status;
    }

    public Boolean getManualOverride() {
        return manualOverride;
    }

    public void setManualOverride(Boolean manualOverride) {
        this.manualOverride = manualOverride;
    }
}
