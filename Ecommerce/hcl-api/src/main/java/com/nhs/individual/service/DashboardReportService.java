package com.nhs.individual.service;

import com.nhs.individual.dto.AdminDashboardStatsDto;
import com.nhs.individual.dto.RecentOrderRowDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

/**
 * DashboardReportService - Generates Excel reports for Admin Dashboard
 * Exports KPI metrics and detailed order information in .xlsx format
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardReportService {
    private final DashboardService dashboardService;

    // ── Styles ──────────────────────────────────────────────────────────────
    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        font.setFontHeightInPoints((short) 12);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        return style;
    }

    private CellStyle createTitleStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 16);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.LEFT);
        return style;
    }

    private CellStyle createDataStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.LEFT);
        return style;
    }

    private CellStyle createCurrencyStyle(Workbook workbook) {
        CellStyle style = createDataStyle(workbook);
        style.setDataFormat(workbook.createDataFormat().getFormat("#,##0 \"₫\""));
        style.setAlignment(HorizontalAlignment.RIGHT);
        return style;
    }

    private CellStyle createDateStyle(Workbook workbook) {
        CellStyle style = createDataStyle(workbook);
        style.setDataFormat(workbook.createDataFormat().getFormat("dd/MM/yyyy HH:mm:ss"));
        return style;
    }

    // ── Public Method ───────────────────────────────────────────────────────
    /**
     * Generate dashboard export report as Excel workbook
     * @return byte array of the generated Excel file
     */
    public byte[] generateDashboardReport() throws IOException {
        log.info("Generating dashboard export report");
        
        try (Workbook workbook = new XSSFWorkbook()) {
            // Fetch dashboard data
            AdminDashboardStatsDto stats = dashboardService.getAdminStats();
            List<RecentOrderRowDto> recentOrders = dashboardService.getRecentOrders(50);
            
            if (recentOrders == null) {
                log.warn("Recent orders returned null, using empty list");
                recentOrders = List.of();
            }
            
            // Create sheets
            if (stats != null) {
                createSummarySheet(workbook, stats);
            } else {
                log.warn("Stats is null, skipping summary sheet");
            }
            
            if (!recentOrders.isEmpty() || recentOrders != null) {
                createDetailedOrdersSheet(workbook, recentOrders);
            }
            
            // Convert to byte array
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            byte[] result = outputStream.toByteArray();
            
            log.info("Dashboard report generated successfully, size: {} bytes", result.length);
            return result;
        }
    }

    // ── Sheet 1: Summary ────────────────────────────────────────────────────
    private void createSummarySheet(Workbook workbook, AdminDashboardStatsDto stats) {
        if (stats == null) {
            log.warn("Stats is null in createSummarySheet");
            return;
        }
        
        Sheet sheet = workbook.createSheet("Dashboard Summary");
        
        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle titleStyle = createTitleStyle(workbook);
        CellStyle dataStyle = createDataStyle(workbook);
        CellStyle currencyStyle = createCurrencyStyle(workbook);
        
        int rowNum = 0;
        
        // ── Title ───────────────────────────────────────────────────────────
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("Admin Dashboard Report");
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new org.apache.poi.ss.util.CellRangeAddress(0, 0, 0, 2));
        
        // ── Report Date ─────────────────────────────────────────────────────
        rowNum++;
        Row dateRow = sheet.createRow(rowNum++);
        Cell dateLabel = dateRow.createCell(0);
        dateLabel.setCellValue("Report Date:");
        dateLabel.setCellStyle(dataStyle);
        Cell dateValue = dateRow.createCell(1);
        dateValue.setCellValue(new SimpleDateFormat("dd/MM/yyyy HH:mm:ss").format(new Date()));
        dateValue.setCellStyle(dataStyle);
        
        // ── Headers ─────────────────────────────────────────────────────────
        rowNum++;
        Row headerRow = sheet.createRow(rowNum++);
        String[] headers = {"Metric Name", "Value", "Growth %"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
        
        // ── Data Rows ───────────────────────────────────────────────────────
        // Total Revenue
        addDataRow(sheet, rowNum++, "Total Revenue", stats.getTotalRevenue(), "₫", dataStyle, currencyStyle);
        
        // Current Month Revenue
        addDataRow(sheet, rowNum++, "Month Revenue", stats.getTotalRevenue(), "₫", dataStyle, currencyStyle);
        addGrowthRow(sheet, rowNum++, "Revenue Growth", stats.getRevenueGrowthRate(), "%", dataStyle);
        
        // Orders Today
        addDataRow(sheet, rowNum++, "Orders Today", stats.getOrdersToday(), "", dataStyle, currencyStyle);
        addGrowthRow(sheet, rowNum++, "Orders Growth (vs Yesterday)", stats.getOrdersTodayGrowth(), "%", dataStyle);
        
        // Products
        addDataRow(sheet, rowNum++, "Total Products", stats.getTotalProducts(), "", dataStyle, currencyStyle);
        addGrowthRow(sheet, rowNum++, "Products Growth", stats.getProductsGrowth(), "%", dataStyle);
        
        // Users
        addDataRow(sheet, rowNum++, "Total Users", stats.getTotalUsers(), "", dataStyle, currencyStyle);
        addGrowthRow(sheet, rowNum++, "Users Growth", stats.getUsersGrowthRate(), "%", dataStyle);
        
        // Low Stock Alerts
        addDataRow(sheet, rowNum++, "Low Stock Items", stats.getLowStockCount(), "", dataStyle, currencyStyle);
        
        // ── Auto-adjust column widths ───────────────────────────────────────
        sheet.autoSizeColumn(0);
        sheet.autoSizeColumn(1);
        sheet.autoSizeColumn(2);
        sheet.setColumnWidth(0, 30 * 256);
    }

    private void addDataRow(Sheet sheet, int rowNum, String metricName, Object value, String unit, CellStyle labelStyle, CellStyle valueStyle) {
        Row row = sheet.createRow(rowNum);
        
        Cell labelCell = row.createCell(0);
        labelCell.setCellValue(metricName);
        labelCell.setCellStyle(labelStyle);
        
        Cell valueCell = row.createCell(1);
        try {
            if (value instanceof BigDecimal) {
                valueCell.setCellValue(((BigDecimal) value).doubleValue());
                valueCell.setCellStyle(valueStyle);
            } else if (value instanceof Long) {
                valueCell.setCellValue(((Long) value).doubleValue());
                valueCell.setCellStyle(labelStyle);
            } else if (value instanceof Integer) {
                valueCell.setCellValue(((Integer) value).doubleValue());
                valueCell.setCellStyle(labelStyle);
            } else {
                valueCell.setCellValue(value != null ? value.toString() : "0");
                valueCell.setCellStyle(labelStyle);
            }
        } catch (Exception e) {
            log.warn("Error setting cell value for {}: {}", metricName, e.getMessage());
            valueCell.setCellValue("N/A");
            valueCell.setCellStyle(labelStyle);
        }
        
        Cell unitCell = row.createCell(2);
        unitCell.setCellValue(unit != null ? unit : "");
        unitCell.setCellStyle(labelStyle);
    }

    private void addGrowthRow(Sheet sheet, int rowNum, String metricName, Object growth, String unit, CellStyle style) {
        Row row = sheet.createRow(rowNum);
        
        Cell labelCell = row.createCell(0);
        labelCell.setCellValue(metricName);
        labelCell.setCellStyle(style);
        
        Cell valueCell = row.createCell(1);
        if (growth instanceof Double) {
            double val = (Double) growth;
            valueCell.setCellValue(new DecimalFormat("0.00").format(val));
        } else if (growth instanceof BigDecimal) {
            valueCell.setCellValue(((BigDecimal) growth).doubleValue());
        } else if (growth instanceof String && "New".equals(growth)) {
            valueCell.setCellValue("New");
        } else {
            valueCell.setCellValue("0.00");
        }
        valueCell.setCellStyle(style);
        
        Cell unitCell = row.createCell(2);
        unitCell.setCellValue(unit);
        unitCell.setCellStyle(style);
    }

    // ── Sheet 2: Detailed Orders ────────────────────────────────────────────
    private void createDetailedOrdersSheet(Workbook workbook, List<RecentOrderRowDto> orders) {
        Sheet sheet = workbook.createSheet("Detailed Orders");
        
        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle dataStyle = createDataStyle(workbook);
        CellStyle currencyStyle = createCurrencyStyle(workbook);
        CellStyle dateStyle = createDateStyle(workbook);
        
        // ── Title ───────────────────────────────────────────────────────────
        Row titleRow = sheet.createRow(0);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("Recent Orders (Last 50)");
        titleCell.setCellStyle(createTitleStyle(workbook));
        sheet.addMergedRegion(new org.apache.poi.ss.util.CellRangeAddress(0, 0, 0, 4));
        
        // ── Headers ─────────────────────────────────────────────────────────
        Row headerRow = sheet.createRow(2);
        String[] headers = {"Order ID", "Customer", "Amount", "Status", "Order Date"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
        
        // ── Data Rows ───────────────────────────────────────────────────────
        int rowNum = 3;
        for (RecentOrderRowDto order : orders) {
            Row row = sheet.createRow(rowNum++);
            
            // Order ID
            Cell idCell = row.createCell(0);
            idCell.setCellValue(order.getOrderId() != null ? order.getOrderId().toString() : "");
            idCell.setCellStyle(dataStyle);
            
            // Customer
            Cell customerCell = row.createCell(1);
            customerCell.setCellValue(order.getCustomerName() != null ? order.getCustomerName() : "");
            customerCell.setCellStyle(dataStyle);
            
            // Amount
            Cell amountCell = row.createCell(2);
            if (order.getAmount() != null) {
                amountCell.setCellValue(order.getAmount().doubleValue());
                amountCell.setCellStyle(currencyStyle);
            } else {
                amountCell.setCellValue(0);
                amountCell.setCellStyle(dataStyle);
            }
            
            // Status
            Cell statusCell = row.createCell(3);
            statusCell.setCellValue(order.getStatus() != null ? order.getStatus() : "");
            statusCell.setCellStyle(dataStyle);
            
            // Date (using formatted string since RecentOrderRowDto has formatted date)
            Cell dateCell = row.createCell(4);
            dateCell.setCellValue(order.getDate() != null ? order.getDate() : "");
            dateCell.setCellStyle(dataStyle);
        }
        
        // ── Auto-adjust column widths ───────────────────────────────────────
        sheet.autoSizeColumn(0);
        sheet.autoSizeColumn(1);
        sheet.autoSizeColumn(2);
        sheet.autoSizeColumn(3);
        sheet.autoSizeColumn(4);
    }
}
