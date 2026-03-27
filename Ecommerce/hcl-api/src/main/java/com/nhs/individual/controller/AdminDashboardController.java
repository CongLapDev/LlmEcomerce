package com.nhs.individual.controller;

import com.nhs.individual.dto.AdminDashboardStatsDto;
import com.nhs.individual.dto.LowStockAlertDto;
import com.nhs.individual.dto.RecentOrderRowDto;
import com.nhs.individual.dto.SalesOverviewPointDto;
import com.nhs.individual.dto.UserGrowthPointDto;
import com.nhs.individual.service.DashboardService;
import com.nhs.individual.service.DashboardReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping({"/api/v1/admin/dashboard", "/admin/dashboard"})
@RequiredArgsConstructor
@Slf4j
public class AdminDashboardController {
    private final DashboardService dashboardService;
    private final DashboardReportService dashboardReportService;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN')")
    public AdminDashboardStatsDto getDashboardStats() {
        return dashboardService.getAdminStats();
    }

    @GetMapping("/sales")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN')")
    public List<SalesOverviewPointDto> getSalesOverview(
            @RequestParam(name = "from", required = false) LocalDate from,
            @RequestParam(name = "to", required = false) LocalDate to,
            @RequestParam(name = "days", required = false, defaultValue = "30") Integer days
    ) {
        return dashboardService.getSalesOverview(from, to, days);
    }

    @GetMapping("/users-growth")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN')")
    public List<UserGrowthPointDto> getUsersGrowth() {
        return dashboardService.getUserGrowthCurrentMonth();
    }

    @GetMapping("/recent-orders")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN')")
    public List<RecentOrderRowDto> getRecentOrders(
            @RequestParam(name = "limit", required = false, defaultValue = "10") Integer limit
    ) {
        return dashboardService.getRecentOrders(limit);
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN')")
    public List<LowStockAlertDto> getLowStockAlerts(
            @RequestParam(name = "threshold", required = false, defaultValue = "5") Integer threshold
    ) {
        return dashboardService.getLowStockAlerts(threshold);
    }

    @GetMapping("/export")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN')")
    public ResponseEntity<byte[]> exportDashboardReport() {
        try {
            log.info("Exporting dashboard report");
            byte[] excelData = dashboardReportService.generateDashboardReport();
            
            if (excelData == null || excelData.length == 0) {
                log.error("Generated Excel file is empty");
                return ResponseEntity.internalServerError().build();
            }
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", "dashboard_report.xlsx");
            headers.setContentLength(excelData.length);
            
            log.info("Dashboard report exported successfully, size: {} bytes", excelData.length);
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(excelData);
        } catch (IOException e) {
            log.error("Error exporting dashboard report: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            log.error("Unexpected error during dashboard export: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
