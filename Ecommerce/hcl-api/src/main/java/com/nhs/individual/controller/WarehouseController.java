package com.nhs.individual.controller;

import com.nhs.individual.domain.Product;
import com.nhs.individual.domain.Warehouse;
import com.nhs.individual.domain.WarehouseItem;
import com.nhs.individual.dto.StockLevelDto;
import com.nhs.individual.dto.StockUpdateRequest;
import com.nhs.individual.dto.WarehouseStatusUpdateRequest;
import com.nhs.individual.exception.ResourceNotFoundException;
import com.nhs.individual.service.ProductService;
import com.nhs.individual.service.WareHouseItemService;
import com.nhs.individual.service.WareHouseService;
import com.nhs.individual.workbook.WarehouseItemXLSX;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collection;

@PreAuthorize("hasAuthority('ADMIN')")
@RestController
@RequestMapping("/api/v1/warehouse")
public class WarehouseController {
    @Autowired
    WareHouseService wareHouseService;
    @Autowired
    ProductService productService;
    @Autowired
    WareHouseItemService wareHouseItemService;
    @RequestMapping(method = RequestMethod.GET)
    public Collection<Warehouse> findAll(){
        return wareHouseService.findAll();
    }

    @RequestMapping(value = "/stock-levels", method = RequestMethod.GET)
    public Collection<StockLevelDto> getStockLevels() {
        return wareHouseService.getStockLevels();
    }

    @RequestMapping(value = "/{warehouse_id}",method = RequestMethod.GET)
    public Warehouse findById(@PathVariable(name = "warehouse_id") Integer id){
        return wareHouseService.findById(id).orElseThrow(()->new ResourceNotFoundException("Warehouse not found"));
    }
    @RequestMapping(method = RequestMethod.POST)
    public Warehouse create(@RequestBody  Warehouse wareHouse){
        return wareHouseService.create(wareHouse);
    }
    @RequestMapping(value = "/{warehouse_id}",method = RequestMethod.PUT)
    public Warehouse update(@PathVariable(name = "warehouse_id") Integer id, Warehouse wareHouse){
        return wareHouseService.update(id,wareHouse);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "/{warehouse_id}/status", method = RequestMethod.PATCH)
    public Warehouse updateWarehouseStatus(@PathVariable(name = "warehouse_id") Integer id,
                                           @RequestBody WarehouseStatusUpdateRequest request) {
        return wareHouseService.updateWarehouseStatus(id, request.getStatus(), request.getManualOverride());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "/{warehouse_id}",method = RequestMethod.DELETE)
    public void deleteById(@PathVariable(name = "warehouse_id") Integer id){
        wareHouseService.deleteById(id);
    }
    //Product accessories
    @RequestMapping(value="/{warehouse_id}/product",method = RequestMethod.GET)
    public Collection<Product> findAllProduct(@PathVariable(name = "warehouse_id") Integer id){
        return productService.findAllByWarehouseId(id);
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "/{warehouse_id}/importXLSX",method = RequestMethod.POST,consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public org.springframework.http.ResponseEntity<?> importGoods(@PathVariable(name = "warehouse_id") Integer warehouseId, @RequestPart(name = "file") MultipartFile file) throws IOException {
        java.util.List<String> errors = new java.util.ArrayList<>();
        java.util.List<com.nhs.individual.dto.WarehouseItemImportDto> parsedItems = WarehouseItemXLSX.read(file.getInputStream(), warehouseId, errors);
        
        Collection<WarehouseItem> savedItems = new java.util.ArrayList<>();
        if (!parsedItems.isEmpty()) {
            savedItems = wareHouseItemService.importGoodsByNameAndId(parsedItems, errors);
        }
        
        int totalRows = parsedItems.size();
        int successCount = savedItems.size();
        int failedCount = errors.size(); // Approximate, as some errors might not belong to parsedItems rows (e.g. empty file, missing headers)

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("totalRows", totalRows);
        response.put("successCount", successCount);
        response.put("failedCount", failedCount);
        response.put("errors", errors);
        response.put("imported", savedItems); // optional but good to keep

        if (totalRows > 0 && successCount == 0) {
            return org.springframework.http.ResponseEntity.badRequest().body(response);
        }
        
        return org.springframework.http.ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "/template", method = RequestMethod.GET)
    public void downloadWarehouseImportTemplate(HttpServletResponse response) throws IOException {
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=warehouse_import_template.xlsx";
        response.setHeader(headerKey, headerValue);
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        
        java.util.Collection<com.nhs.individual.domain.ProductItem> availableProducts = productService.findAllProductItems();
        
        try (org.apache.poi.xssf.usermodel.XSSFWorkbook workbook = com.nhs.individual.workbook.WarehouseTemplateXLSX.generate(availableProducts)) {
            workbook.write(response.getOutputStream());
            response.flushBuffer();
        }
    }
    //Product Item In warehouse
    @RequestMapping(value ="/{warehouse_id}/item/{id}",method = RequestMethod.GET)
    public WarehouseItem findItemByWarehouseId(@PathVariable(name = "warehouse_id")Integer warehouseId,
                                                           @PathVariable(name = "id") Integer id){
        return wareHouseItemService.findByItemIdAndWarehouseId(id,warehouseId).orElseThrow(
                ()->new ResourceNotFoundException("Warehouse item not found")
        );
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "/{warehouseId}/item/{id}", method = RequestMethod.POST)
    public WarehouseItem createItem(@PathVariable(name = "warehouseId") Integer warehouseId,
                                    @PathVariable(name = "id") Integer id,
                                    @RequestBody WarehouseItem warehouseItem){
        return wareHouseItemService.importNewItem(warehouseId,id,warehouseItem);
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "/{warehouseId}/item/{id}", method = RequestMethod.PUT)
    public void updateItem(@PathVariable(name = "warehouseId") Integer warehouseId,
                                    @PathVariable(name = "id") Integer id,
                                    @RequestBody WarehouseItem warehouseItem){
        wareHouseItemService.update(warehouseId, id,warehouseItem);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "/{warehouse_id}/stock/{item_id}", method = RequestMethod.POST)
    public WarehouseItem addOrUpdateStock(@PathVariable(name = "warehouse_id") Integer warehouseId,
                                          @PathVariable(name = "item_id") Integer itemId,
                                          @RequestBody StockUpdateRequest request) {
        return wareHouseService.addOrUpdateStock(warehouseId, itemId, request.getQuantity(), request.getSku());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "/{warehouseId}/item/{id}",method = RequestMethod.DELETE)
    public void deleteItem(@PathVariable(name = "warehouseId") Integer warehouseId,
                                    @PathVariable(name = "id") Integer id){
        wareHouseItemService.deleteItemFromWarehouse(id,warehouseId);
    }



}
