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

            int idColIdx = -1;
            int nameColIdx = -1;
            int skuColIdx = -1;
            int qtyColIdx = -1;

            if (rows.hasNext()) {
                Row headerRow = rows.next();
                for (Cell cell : headerRow) {
                    if (cell.getCellType() == org.apache.poi.ss.usermodel.CellType.STRING) {
                        String headerValue = cell.getStringCellValue().trim().toUpperCase();
                        if ("PRODUCT_ITEM_ID".equals(headerValue)) idColIdx = cell.getColumnIndex();
                        if ("PRODUCT_NAME".equals(headerValue)) nameColIdx = cell.getColumnIndex();
                        if ("SKU".equals(headerValue)) skuColIdx = cell.getColumnIndex();
                        if ("QUANTITY".equals(headerValue)) qtyColIdx = cell.getColumnIndex();
                    }
                }
            }

            if (qtyColIdx == -1) {
                errors.add("Missing required header in Excel. Expected 'QUANTITY'.");
                return importDtos;
            }
            if (idColIdx == -1 && nameColIdx == -1 && skuColIdx == -1) {
                errors.add("Missing identifier headers. Expected at least 'PRODUCT_ITEM_ID' or 'PRODUCT_NAME'.");
                return importDtos;
            }

            while (rows.hasNext()) {
                Row row = rows.next();

                try {
                    // Skip completely empty trailing rows
                    if ((idColIdx == -1 || row.getCell(idColIdx) == null) &&
                        (nameColIdx == -1 || row.getCell(nameColIdx) == null) &&
                        (skuColIdx == -1 || row.getCell(skuColIdx) == null) && 
                        (row.getCell(qtyColIdx) == null)) {
                        continue;
                    }

                    if (row.getCell(qtyColIdx) == null) {
                        String errMsg = "Row " + (row.getRowNum() + 1) + ": Missing required column QUANTITY";
                        log.warn(errMsg);
                        errors.add(errMsg);
                        continue;
                    }

                    Integer productId = null;
                    if (idColIdx != -1 && row.getCell(idColIdx) != null) {
                        if (row.getCell(idColIdx).getCellType() == org.apache.poi.ss.usermodel.CellType.NUMERIC) {
                            productId = (int) row.getCell(idColIdx).getNumericCellValue();
                        } else if (row.getCell(idColIdx).getCellType() == org.apache.poi.ss.usermodel.CellType.STRING) {
                            try {
                                productId = Integer.parseInt(row.getCell(idColIdx).getStringCellValue().trim());
                            } catch (NumberFormatException ignored) {}
                        }
                    }

                    String productName = null;
                    if (nameColIdx != -1 && row.getCell(nameColIdx) != null) {
                        if (row.getCell(nameColIdx).getCellType() == org.apache.poi.ss.usermodel.CellType.STRING) {
                            productName = row.getCell(nameColIdx).getStringCellValue();
                        } else if (row.getCell(nameColIdx).getCellType() == org.apache.poi.ss.usermodel.CellType.NUMERIC) {
                             productName = String.valueOf((long) row.getCell(nameColIdx).getNumericCellValue());
                        }
                    }

                    if (productName != null) {
                        // Normalize the string
                        productName = java.text.Normalizer.normalize(productName, java.text.Normalizer.Form.NFD);
                        productName = productName.replaceAll("\\p{M}", ""); // remove accents
                        productName = productName.trim().toLowerCase().replaceAll("\\s+", " ");
                    }

                    String sku = null;
                    if (skuColIdx != -1 && row.getCell(skuColIdx) != null) {
                        if (row.getCell(skuColIdx).getCellType() == org.apache.poi.ss.usermodel.CellType.NUMERIC) {
                            sku = String.valueOf((long) row.getCell(skuColIdx).getNumericCellValue());
                        } else {
                            sku = row.getCell(skuColIdx).getStringCellValue();
                        }
                    }
                    if (sku != null) sku = sku.trim();

                    if (productId == null && (productName == null || productName.isEmpty()) && (sku == null || sku.isEmpty())) {
                        String errMsg = "Row " + (row.getRowNum() + 1) + ": Missing identifier (ID, Name, or SKU)";
                        log.warn(errMsg);
                        errors.add(errMsg);
                        continue;
                    }

                    Integer qty = (int) row.getCell(qtyColIdx).getNumericCellValue();

                    if (qty < 0) {
                        String errMsg = "Row " + (row.getRowNum() + 1) + ": Quantity cannot be negative";
                        log.warn(errMsg);
                        errors.add(errMsg);
                        continue;
                    }

                    com.nhs.individual.dto.WarehouseItemImportDto dto = new com.nhs.individual.dto.WarehouseItemImportDto();
                    dto.setWarehouseId(pathWarehouseId);
                    dto.setProductItemId(productId);
                    dto.setProductName(productName);
                    dto.setSku(sku);
                    dto.setQty(qty);
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
