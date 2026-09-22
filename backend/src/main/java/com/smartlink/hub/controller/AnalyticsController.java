package com.smartlink.hub.controller;

import com.smartlink.hub.dto.ApiResponse;
import com.smartlink.hub.entity.AnalyticsEvent;
import com.smartlink.hub.entity.AnalyticsEventType;
import com.smartlink.hub.security.UserPrincipal;
import com.smartlink.hub.service.AnalyticsService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AnalyticsEvent>>> getMyAnalytics(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) AnalyticsEventType eventType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<AnalyticsEvent> events = analyticsService.getUserAnalytics(currentUser.getId(), eventType, startDate, endDate, pageable);
        return ResponseEntity.ok(ApiResponse.success(events));
    }
}
