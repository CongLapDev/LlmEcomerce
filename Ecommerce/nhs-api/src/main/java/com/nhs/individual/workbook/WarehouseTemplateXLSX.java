package com.nhs.individual.workbook;

import com.nhs.individual.domain.ProductItem;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.util.Collection;

public class WarehouseTemplateXLSX {

    public static XSSFWorkbook generate(Collection<ProductItem> productItems) {
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("Warehouse_Import_Template");

        // Format header style
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setColor(IndexedColors.WHITE.getIndex());
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        // Required field style
        CellStyle requiredHeaderStyle = workbook.createCellStyle();
        Font requiredFont = workbook.createFont();
        requiredFont.setBold(true);
        requiredFont.setColor(IndexedColors.WHITE.getIndex());
        requiredHeaderStyle.setFont(requiredFont);
        requiredHeaderStyle.setFillForegroundColor(IndexedColors.RED.getIndex());
        requiredHeaderStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        // Create headers
        Row headerRow = sheet.createRow(0);
        
        Cell cellSku = headerRow.createCell(0);
        cellSku.setCellValue("SKU");
        cellSku.setCellStyle(requiredHeaderStyle); // Make SKU stand out as essential mapping key

        Cell cellName = headerRow.createCell(1);
        cellName.setCellValue("PRODUCT_NAME");
        cellName.setCellStyle(headerStyle);

        Cell cellQty = headerRow.createCell(2);
        cellQty.setCellValue("QUANTITY");
        cellQty.setCellStyle(requiredHeaderStyle); 

        // Populate product rows
        int rowIdx = 1;
        for (ProductItem item : productItems) {
            String sku = item.getSku() != null ? item.getSku() : "";
            // If SKU is blank, it's unusable for import. Skip or still list it? 
            // Better to show it so admins know it's missing SKUs, but we want a valid template.
            String productName = item.getProduct() != null ? item.getProduct().getName() : "Unknown Product";
            
            // Build variation suffix if options exist
            if (item.getOptions() != null && !item.getOptions().isEmpty()) {
                String variant = String.join(", ", item.getOptions().stream()
                        .map(opt -> opt.getVariation().getName() + ": " + opt.getValue())
                        .toList());
                productName += " (" + variant + ")";
            }

            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(sku);
            row.createCell(1).setCellValue(productName);
            // Column 2 (Quantity) intentionally left blank
        }

        // Add note/instruction row at the very top, wait, freeze pane is better if we just use sheet features.
        // Freeze header row
        sheet.createFreezePane(0, 1);

        // Auto-size columns for readability
        sheet.autoSizeColumn(0);
        sheet.autoSizeColumn(1);
        sheet.setColumnWidth(2, 5000); // Set fixed width for quantity so it has space

        return workbook;
    }
}
