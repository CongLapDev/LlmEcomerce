package com.nhs.individual.workbook;


import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WarehouseItemXLSX {
    private static final Logger log = LoggerFactory.getLogger(WarehouseItemXLSX.class);

    public static List<com.nhs.individual.dto.WarehouseItemImportDto> read(InputStream inputStream, Integer pathWarehouseId, List<String> errors) {
        List<com.nhs.individual.dto.WarehouseItemImportDto> importDtos = new ArrayList<>();
        // try-with-resources guarantees InputStream and Workbook are safely closed
        try (inputStream; XSSFWorkbook workbook = new XSSFWorkbook(inputStream)) {
            if (workbook.getNumberOfSheets() == 0) {
                errors.add("Excel file is empty");
                return importDtos;
            }
            XSSFSheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            int skuColIdx = -1;
            int qtyColIdx = -1;

            if (rows.hasNext()) {
                Row headerRow = rows.next();
                for (Cell cell : headerRow) {
                    if (cell.getCellType() == org.apache.poi.ss.usermodel.CellType.STRING) {
                        String headerValue = cell.getStringCellValue().trim().toUpperCase();
                        if ("SKU".equals(headerValue)) skuColIdx = cell.getColumnIndex();
                        if ("QUANTITY".equals(headerValue)) qtyColIdx = cell.getColumnIndex();
                    }
                }
            }

            if (skuColIdx == -1 || qtyColIdx == -1) {
                errors.add("Missing required headers in Excel. Expected exactly 'SKU' and 'QUANTITY'.");
                return importDtos;
            }

            while (rows.hasNext()) {
                Row row = rows.next();

                try {
                    // Skip completely empty trailing rows
                    if (row.getCell(skuColIdx) == null && row.getCell(qtyColIdx) == null) {
                        continue;
                    }

                    if (row.getCell(skuColIdx) == null || row.getCell(qtyColIdx) == null) {
                        String errMsg = "Row " + (row.getRowNum() + 1) + ": Missing required cells (SKU or Qty)";
                        log.warn(errMsg);
                        errors.add(errMsg);
                        continue;
                    }

                    String sku;
                    // Handle numeric SKUs if Excel auto-formats them as numbers
                    if (row.getCell(skuColIdx).getCellType() == org.apache.poi.ss.usermodel.CellType.NUMERIC) {
                        sku = String.valueOf((long) row.getCell(skuColIdx).getNumericCellValue());
                    } else {
                        sku = row.getCell(skuColIdx).getStringCellValue();
                    }

                    if (sku == null || sku.trim().isEmpty()) {
                        String errMsg = "Row " + (row.getRowNum() + 1) + ": SKU cannot be empty";
                        log.warn(errMsg);
                        errors.add(errMsg);
                        continue;
                    }

                    Integer qty = (int) row.getCell(qtyColIdx).getNumericCellValue();

                    if (qty < 0) {
                        String errMsg = "Row " + (row.getRowNum() + 1) + ": Quantity cannot be negative for SKU " + sku;
                        log.warn(errMsg);
                        errors.add(errMsg);
                        continue;
                    }

                    com.nhs.individual.dto.WarehouseItemImportDto dto = new com.nhs.individual.dto.WarehouseItemImportDto(pathWarehouseId, sku.trim(), qty);
                    importDtos.add(dto);

                } catch (IllegalStateException | NumberFormatException e) {
                    String errMsg = "Row " + (row.getRowNum() + 1) + ": Invalid data format - Qty must be numeric";
                    log.error(errMsg, e);
                    errors.add(errMsg);
                } catch (Exception e) {
                    String errMsg = "Row " + (row.getRowNum() + 1) + ": Unexpected error - " + e.getMessage();
                    log.error(errMsg, e);
                    errors.add(errMsg);
                }
            }
        } catch (IOException e) {
            String errMsg = "Failed to read Excel file streams: " + e.getMessage();
            log.error(errMsg, e);
            errors.add(errMsg);
        } catch (Exception e) {
            String errMsg = "Unexpected error parsing Excel file: " + e.getMessage();
            log.error(errMsg, e);
            errors.add(errMsg);
        }
        return importDtos;
    }
}
