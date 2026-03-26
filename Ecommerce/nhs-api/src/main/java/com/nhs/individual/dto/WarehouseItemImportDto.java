package com.nhs.individual.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseItemImportDto {
    private Integer warehouseId;
    private String sku;
    private Integer qty;
}
