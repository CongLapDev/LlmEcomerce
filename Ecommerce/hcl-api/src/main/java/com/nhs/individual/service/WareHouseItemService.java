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
    public List<WarehouseItem> importGoodsByNameAndId(List<com.nhs.individual.dto.WarehouseItemImportDto> importDtos, List<String> errors) {
        java.util.List<WarehouseItem> savedItems = new java.util.ArrayList<>();
        
        log.info("Starting warehouse import process for {} items", importDtos.size());

        // Fetch all product items for O(1) lookup
        List<ProductItem> allItems = productItemRepository.findAll();
        java.util.Map<Integer, ProductItem> idMap = new java.util.HashMap<>();
        java.util.Map<String, java.util.List<ProductItem>> nameMap = new java.util.HashMap<>();
        java.util.Map<String, ProductItem> skuMap = new java.util.HashMap<>();

        for (ProductItem pi : allItems) {
            idMap.put(pi.getId(), pi);
            if (pi.getSku() != null && !pi.getSku().isBlank()) {
                skuMap.put(pi.getSku().trim(), pi);
            }
            // Generate product name for fallback match
            String name = pi.getProduct() != null ? pi.getProduct().getName() : "Unknown Product";
            if (pi.getOptions() != null && !pi.getOptions().isEmpty()) {
                String variant = String.join(", ", pi.getOptions().stream()
                        .map(opt -> opt.getVariation().getName() + ": " + opt.getValue())
                        .toList());
                name += " (" + variant + ")";
            }
            // Normalize name exactly like the Excel parser
            name = java.text.Normalizer.normalize(name, java.text.Normalizer.Form.NFD);
            name = name.replaceAll("\\p{M}", "");
            name = name.trim().toLowerCase().replaceAll("\\s+", " ");
            
            nameMap.computeIfAbsent(name, k -> new java.util.ArrayList<>()).add(pi);
        }
        
        for (int i = 0; i < importDtos.size(); i++) {
            com.nhs.individual.dto.WarehouseItemImportDto dto = importDtos.get(i);
            int rowNumber = i + 2; // Approximate Excel row number

            log.info("Processing row {}: ID='{}', Name='{}', SKU='{}', Qty={}", 
                rowNumber, dto.getProductItemId(), dto.getProductName(), dto.getSku(), dto.getQty());

            try {
                // 1. Basic Quantity Validation
                if (dto.getQty() == null || dto.getQty() < 0) {
                    errors.add("Row " + rowNumber + ": Invalid quantity (" + dto.getQty() + ")");
                    continue;
                }

                ProductItem productItem = null;

                // 2. Discover ProductItem by Priority: ID > Name > SKU
                if (dto.getProductItemId() != null) {
                    productItem = idMap.get(dto.getProductItemId());
                    if (productItem == null) {
                        String errMsg = "Row " + rowNumber + ": Product Item ID '" + dto.getProductItemId() + "' not found in system";
                        log.warn(errMsg);
                        errors.add(errMsg);
                        continue;
                    }
                } else if (dto.getProductName() != null && !dto.getProductName().isEmpty()) {
                    java.util.List<ProductItem> matches = nameMap.get(dto.getProductName());
                    if (matches == null || matches.isEmpty()) {
                        String errMsg = "Row " + rowNumber + ": Product Name '" + dto.getProductName() + "' not found in system";
                        log.warn(errMsg);
                        errors.add(errMsg);
                        continue;
                    } else if (matches.size() > 1) {
                        String errMsg = "Row " + rowNumber + ": Ambiguous product name '" + dto.getProductName() + "' matched multiple variants. Please provide PRODUCT_ITEM_ID instead.";
                        log.warn(errMsg);
                        errors.add(errMsg);
                        continue;
                    }
                    productItem = matches.get(0);
                } else if (dto.getSku() != null && !dto.getSku().isEmpty() && skuMap.containsKey(dto.getSku())) {
                    // Fallback to SKU if ID and Name are missing but SKU is provided
                    productItem = skuMap.get(dto.getSku());
                } else {
                    String errMsg = "Row " + rowNumber + ": Missing identifier. Provide PRODUCT_ITEM_ID, PRODUCT_NAME, or SKU.";
                    log.warn(errMsg);
                    errors.add(errMsg);
                    continue;
                }

                // Auto-fill SKU internally for logs just in case
                if (productItem.getSku() != null) {
                    dto.setSku(productItem.getSku());
                }

                // 3. Prevent detached composite key override - query existing DB
                ProductItemInWarehouseId id = new ProductItemInWarehouseId(productItem.getId(), dto.getWarehouseId());
                
                Optional<WarehouseItem> existingItemOpt = repository.findById(id);
                WarehouseItem warehouseItem;
                
                if (existingItemOpt.isPresent()) {
                    warehouseItem = existingItemOpt.get();
                } else {
                    log.info("Row {}: Constructing NEW WarehouseItem mapping for variant ID '{}'", rowNumber, productItem.getId());
                    warehouseItem = new WarehouseItem();
                    warehouseItem.setId(id);
                    
                    Warehouse warehouse = new Warehouse();
                    warehouse.setId(dto.getWarehouseId());
                    
                    warehouseItem.setWarehouse(warehouse);
                    warehouseItem.setProductItem(productItem);
                    warehouseItem.setQty(0);
                }

                // 4. Safely handle quantities (INCREMENT!)
                int currentQty = warehouseItem.getQty() == null ? 0 : warehouseItem.getQty();
                warehouseItem.setQty(currentQty + dto.getQty());

                // 5. Add to batch list instead of saving per row
                savedItems.add(warehouseItem);
                
                log.info("Row {}: Successfully queued item ID '{}' - New Total Qty: {}", rowNumber, productItem.getId(), warehouseItem.getQty());
                
            } catch (Exception e) {
                log.error("Row {}: FATAL error processing item: {}", rowNumber, e.getMessage(), e);
                errors.add("Row " + rowNumber + ": System failed to process item. Reason: " + e.getMessage());
            }
        }
        
        // 6. Batch save all items to prevent N+1 queries
        if (!savedItems.isEmpty()) {
            savedItems = repository.saveAll(savedItems);
        }
        
        log.info("Import process finished. Successfully saved {}/{} variants.", savedItems.size(), importDtos.size());
        return savedItems;
    }
}
