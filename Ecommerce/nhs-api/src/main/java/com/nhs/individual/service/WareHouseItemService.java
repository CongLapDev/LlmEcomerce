package com.nhs.individual.service;

import com.nhs.individual.domain.EmbeddedId.ProductItemInWarehouseId;
import com.nhs.individual.domain.ProductItem;
import com.nhs.individual.domain.Warehouse;
import com.nhs.individual.domain.WarehouseItem;
import com.nhs.individual.exception.ResourceNotFoundException;
import com.nhs.individual.repository.WarehouseItemRepository;
import com.nhs.individual.utils.ObjectUtils;
import com.nhs.individual.validation.WarehouseValidation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.util.List;
import java.util.Optional;

@Service
public class WareHouseItemService {
    @Autowired
    WarehouseItemRepository repository;
    public Optional<WarehouseItem> findByItemIdAndWarehouseId(Integer itemId, Integer warehouseId){
        return repository.findById(new ProductItemInWarehouseId(itemId,warehouseId));
    }
    public void deleteItemFromWarehouse(Integer itemId, Integer warehouseId){
        repository.deleteById(new ProductItemInWarehouseId(itemId,warehouseId));
    }
    public void update(Integer itemId, Integer warehouseId,WarehouseItem warehouseItem){
        ProductItemInWarehouseId id=new ProductItemInWarehouseId(itemId,warehouseId);
        warehouseItem.setId(id);
        repository.findById(id)
                .map(oldItem-> repository.save(ObjectUtils.merge(oldItem,warehouseItem,WarehouseItem.class)))
                .orElseThrow(()->new ResourceNotFoundException("Product Item not found"));
    }
    public WarehouseItem importNewItem(Integer warehouseId,Integer itemId,WarehouseItem warehouseItem){
        warehouseItem.setId(new ProductItemInWarehouseId(itemId,warehouseId));
        ProductItem productItem=new ProductItem();
        productItem.setId(itemId);
        warehouseItem.setProductItem(productItem);
        Warehouse warehouse=new Warehouse();
        warehouse.setId(warehouseId);
        warehouseItem.setWarehouse(warehouse);
        WarehouseItem warehouseItem1=repository.save(warehouseItem);
        return warehouseItem1;
    }
    @Autowired
    com.nhs.individual.repository.ProductItemRepository productItemRepository;

    @Transactional
    public List<WarehouseItem> importGoods(@Validated(WarehouseValidation.onCreate.class) List<@Valid WarehouseItem> warehouseItems){
        return repository.saveAll(warehouseItems);
    }

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(WareHouseItemService.class);

    @Transactional
    public List<WarehouseItem> importGoodsBySku(List<com.nhs.individual.dto.WarehouseItemImportDto> importDtos, List<String> errors) {
        java.util.List<WarehouseItem> savedItems = new java.util.ArrayList<>();
        
        log.info("Starting warehouse import process for {} items", importDtos.size());
        
        for (int i = 0; i < importDtos.size(); i++) {
            com.nhs.individual.dto.WarehouseItemImportDto dto = importDtos.get(i);
            int rowNumber = i + 2; // Approximate Excel row number

            log.info("Processing row {}: SKU='{}', Qty={}", rowNumber, dto.getSku(), dto.getQty());

            try {
                // 1. Basic Quantity Validation
                if (dto.getQty() == null || dto.getQty() < 0) {
                    errors.add("Row " + rowNumber + ": Invalid quantity (" + dto.getQty() + ") for SKU '" + dto.getSku() + "'");
                    continue;
                }

                // 2. Discover ProductItem by SKU Map
                Optional<ProductItem> productItemOpt = productItemRepository.findBySku(dto.getSku());
                if (productItemOpt.isEmpty()) {
                    log.warn("Row {}: SKU '{}' not found. Skipping.", rowNumber, dto.getSku());
                    errors.add("Row " + rowNumber + ": SKU '" + dto.getSku() + "' not found in system");
                    continue; // Correctly skip invalid row
                }
                ProductItem productItem = productItemOpt.get();

                // 3. Prevent detached composite key override - query existing DB
                ProductItemInWarehouseId id = new ProductItemInWarehouseId(productItem.getId(), dto.getWarehouseId());
                
                WarehouseItem warehouseItem = repository.findById(id).orElseGet(() -> {
                    log.info("Row {}: Constructing NEW WarehouseItem mapping for SKU '{}'", rowNumber, dto.getSku());
                    WarehouseItem newItem = new WarehouseItem();
                    newItem.setId(id);
                    
                    Warehouse warehouse = new Warehouse();
                    warehouse.setId(dto.getWarehouseId());
                    
                    newItem.setWarehouse(warehouse);
                    newItem.setProductItem(productItem);
                    newItem.setQty(0);
                    return newItem;
                });

                // 4. Safely handle quantities (INCREMENT!)
                int currentQty = warehouseItem.getQty() == null ? 0 : warehouseItem.getQty();
                warehouseItem.setQty(currentQty + dto.getQty());

                // 5. Per-Row Save with Catch Block
                WarehouseItem savedItem = repository.save(warehouseItem);
                savedItems.add(savedItem);
                
                log.info("Row {}: Successfully saved SKU '{}' - New Total Qty: {}", rowNumber, dto.getSku(), savedItem.getQty());
                
            } catch (Exception e) {
                log.error("Row {}: FATAL error parsing SKU '{}': {}", rowNumber, dto.getSku(), e.getMessage(), e);
                errors.add("Row " + rowNumber + ": System failed to save SKU '" + dto.getSku() + "'. Reason: " + e.getMessage());
            }
        }
        
        log.info("Import process finished. Successfully saved {}/{} variants.", savedItems.size(), importDtos.size());
        return savedItems;
    }
}
