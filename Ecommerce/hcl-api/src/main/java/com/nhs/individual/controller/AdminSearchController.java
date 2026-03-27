package com.nhs.individual.controller;

import com.nhs.individual.dto.AdminGlobalSearchResponseDto;
import com.nhs.individual.service.AdminSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/v1/admin/search", "/admin/search"})
@RequiredArgsConstructor
public class AdminSearchController {
    private final AdminSearchService adminSearchService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ADMIN')")
    public AdminGlobalSearchResponseDto search(
            @RequestParam(name = "query") String query,
            @RequestParam(name = "limit", required = false, defaultValue = "5") Integer limit
    ) {
        return adminSearchService.search(query, limit);
    }
}
