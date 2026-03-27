package com.nhs.individual.service;

import com.nhs.individual.constant.WarehouseStatus;
import com.nhs.individual.domain.EmbeddedId.ProductItemInWarehouseId;
import com.nhs.individual.domain.ProductItem;
import com.nhs.individual.domain.Warehouse;
import com.nhs.individual.domain.WarehouseItem;
import com.nhs.individual.dto.StockLevelDto;
import com.nhs.individual.exception.ResourceNotFoundException;
import com.nhs.individual.repository.ProductItemRepository;
import com.nhs.individual.repository.WareHouseRepository;
import com.nhs.individual.repository.WarehouseItemRepository;
import com.nhs.individual.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
public class WareHouseService {
    @Autowired
    WareHouseRepository wareHouseRepository;
    @Autowired
    WarehouseItemRepository warehouseItemRepository;
    @Autowired
    ProductItemRepository productItemRepository;

    public Warehouse create(Warehouse wareHouse){
        if (!Boolean.TRUE.equals(wareHouse.getStatusManualOverride())) {
            applyStatusBasedOnCapacity(wareHouse);
        }
        return wareHouseRepository.save(wareHouse);
    }

    public Collection<Warehouse> findAll(){
        return wareHouseRepository.findAll();
    }

    public Optional<Warehouse> findById(int id){
        return wareHouseRepository.findById(id);
    }

    public void deleteById(int id){
        wareHouseRepository.deleteById(id);
    }

    public Warehouse update(Integer id,Warehouse wareHouse){
        Warehouse updatedWarehouse = wareHouseRepository.save(findById(id).map(oldWareHouse ->
                ObjectUtils.merge(oldWareHouse, wareHouse, Warehouse.class)
        ).orElseThrow(() -> new ResourceNotFoundException("warehouse not found")));

        if (!Boolean.TRUE.equals(updatedWarehouse.getStatusManualOverride())) {
            applyStatusBasedOnCapacity(updatedWarehouse);
            return wareHouseRepository.save(updatedWarehouse);
        }
        return updatedWarehouse;
    }

    public List<StockLevelDto> getStockLevels() {
        return warehouseItemRepository.findAllStockLevels().stream()
                .map(item -> new StockLevelDto(
                        item.getProductItemId(),
                        item.getProductName(),
                        item.getWarehouseId(),
                        item.getWarehouseName(),
                        item.getSku(),
                        nonNull(item.getQuantity())
                ))
                .toList();
    }

    @Transactional
    public WarehouseItem addOrUpdateStock(Integer warehouseId, Integer productItemId, Integer quantityDelta, String sku) {
        if (quantityDelta == null || quantityDelta == 0) {
            throw new IllegalArgumentException("quantity must be non-zero");
        }

        Warehouse warehouse = wareHouseRepository.findById(warehouseId)
                .orElseThrow(() -> new ResourceNotFoundException("warehouse not found"));
        ProductItem productItem = productItemRepository.findById(productItemId)
                .orElseThrow(() -> new ResourceNotFoundException("product item not found"));

        ProductItemInWarehouseId id = new ProductItemInWarehouseId(productItemId, warehouseId);
        WarehouseItem warehouseItem = warehouseItemRepository.findById(id).orElseGet(() -> {
            WarehouseItem created = new WarehouseItem();
            created.setId(id);
            created.setWarehouse(warehouse);
            created.setProductItem(productItem);
            created.setQty(0);
            return created;
        });

        int updatedQuantity = nonNull(warehouseItem.getQty()) + quantityDelta;
        if (updatedQuantity < 0) {
            throw new IllegalArgumentException("quantity cannot be negative");
        }
        warehouseItem.setQty(updatedQuantity);
        if (sku != null && !sku.isBlank()) {
            warehouseItem.setSKU(sku.trim());
        }

        WarehouseItem savedItem = warehouseItemRepository.save(warehouseItem);
        refreshWarehouseStatus(warehouseId);
        return savedItem;
    }

    @Transactional
    public Warehouse updateWarehouseStatus(Integer warehouseId, WarehouseStatus status, Boolean manualOverride) {
        Warehouse warehouse = wareHouseRepository.findById(warehouseId)
                .orElseThrow(() -> new ResourceNotFoundException("warehouse not found"));

        if (Boolean.TRUE.equals(manualOverride)) {
            if (status == null) {
                throw new IllegalArgumentException("status is required when manualOverride is true");
            }
            warehouse.setStatusManualOverride(true);
            warehouse.setStatus(status);
            return wareHouseRepository.save(warehouse);
        }

        if (Boolean.FALSE.equals(manualOverride)) {
            warehouse.setStatusManualOverride(false);
            applyStatusBasedOnCapacity(warehouse);
            return wareHouseRepository.save(warehouse);
        }

        if (status != null) {
            warehouse.setStatusManualOverride(true);
            warehouse.setStatus(status);
            return wareHouseRepository.save(warehouse);
        }

        applyStatusBasedOnCapacity(warehouse);
        return wareHouseRepository.save(warehouse);
    }

    @Transactional
    public Warehouse refreshWarehouseStatus(Integer warehouseId) {
        Warehouse warehouse = wareHouseRepository.findById(warehouseId)
                .orElseThrow(() -> new ResourceNotFoundException("warehouse not found"));
        if (Boolean.TRUE.equals(warehouse.getStatusManualOverride())) {
            return warehouse;
        }
        applyStatusBasedOnCapacity(warehouse);
        return wareHouseRepository.save(warehouse);
    }

    private void applyStatusBasedOnCapacity(Warehouse warehouse) {
        Integer totalStock = nonNull(warehouseItemRepository.sumQuantityByWarehouseId(warehouse.getId()));
        Integer maxCapacity = warehouse.getMaxCapacity();

        if (maxCapacity != null && maxCapacity > 0 && totalStock >= maxCapacity) {
            warehouse.setStatus(WarehouseStatus.FULL);
            return;
        }
        warehouse.setStatus(WarehouseStatus.OPERATIONAL);
    }

    private Integer nonNull(Integer value) {
        return value == null ? 0 : value;
    }

    public void transport(ProductItem productItem,Warehouse origin,Warehouse destination,int qty){

    }
}
