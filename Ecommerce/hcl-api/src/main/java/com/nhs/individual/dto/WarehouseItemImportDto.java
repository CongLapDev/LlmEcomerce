package com.nhs.individual.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseItemImportDto {
    private Integer warehouseId;
    private Integer productItemId;
    private String productName;
    private String sku; // Retained for backwards compatibility
    private Integer qty;
}
